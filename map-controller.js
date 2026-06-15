// ============================================================
// 地図コントローラ
// ------------------------------------------------------------
// 地図の初期化、マーカーの生成・破棄、スタイル切り替えを担当する。
// UI（ボタンなど）からはこのモジュールが提供する関数だけを呼び出す。
// ============================================================

import { countries, mapStyles, buildPopupHTML, getMarkerColor } from "./data.js";

// 現在のマーカーとポップアップを保持する内部状態
// { id: { marker, popup } } の形式
const markerState = {};

let mapInstance = null;

// ------------------------------------------------------------
// 地図インスタンスを初期化する
// ------------------------------------------------------------
export function initMap(containerId) {
    mapInstance = new maplibregl.Map({
        container: containerId,
        style: mapStyles.real, // 最初は実際の地図
        center: [139.6917, 35.6895], // 日本付近を初期表示
        zoom: 4
    });

    mapInstance.addControl(new maplibregl.NavigationControl());

    mapInstance.on("load", () => {
        createAllMarkers(false); // 初回は real モード
    });

    return mapInstance;
}

// ------------------------------------------------------------
// すべての国のマーカー・ポップアップを生成する
// isFantasy: true ならファンタジー側のテキストを使用する
// ------------------------------------------------------------
export function createAllMarkers(isFantasy) {
    removeAllMarkers();

    countries.forEach((country) => {
        const popup = new maplibregl.Popup().setHTML(
            buildPopupHTML(country, isFantasy)
        );

        const marker = new maplibregl.Marker({
            color: getMarkerColor(country, isFantasy)
        })
            .setLngLat(country.coordinates)
            .setPopup(popup)
            .addTo(mapInstance);

        markerState[country.id] = { marker, popup };
    });
}

// ------------------------------------------------------------
// 既存のマーカー・ポップアップをすべて取り除く
// ------------------------------------------------------------
export function removeAllMarkers() {
    Object.keys(markerState).forEach((id) => {
        const state = markerState[id];
        if (state.popup) {
            state.popup.remove();
        }
        if (state.marker) {
            state.marker.remove();
        }
        delete markerState[id];
    });
}

// ------------------------------------------------------------
// どの国のポップアップが開いていたかを記録する
// 戻り値: 開いていた国の id の配列
// ------------------------------------------------------------
function getOpenPopupIds() {
    return Object.keys(markerState).filter((id) => {
        const state = markerState[id];
        return state.popup && state.popup.isOpen();
    });
}

// ------------------------------------------------------------
// 地図のスタイルとマーカー内容を、指定モードに切り替える
// isFantasy: true なら fantasy モード、false なら real モード
// onComplete: 切り替え完了時に呼ばれるコールバック（省略可）
// ------------------------------------------------------------
export function switchMode(isFantasy, onComplete) {
    const openIds = getOpenPopupIds();

    const targetStyle = isFantasy ? mapStyles.fantasy : mapStyles.real;
    mapInstance.setStyle(targetStyle);

    // setStyle 後、スタイルの読み込みが完了するまで待つ。
    //
    // 補足:
    // "style.load" イベントは、setStyle() 実行から once() 登録までの間に
    // 既に発火してしまい、リスナーが呼ばれないケースがある
    // （スタイルがキャッシュ済みの場合など）。
    // そのため isStyleLoaded() による状態確認を併用し、
    // 取り逃しがあっても確実に後続処理が実行されるようにする。
    function waitForStyleLoaded() {
        if (mapInstance.isStyleLoaded()) {
            onStyleReady();
        } else {
            mapInstance.once("styledata", waitForStyleLoaded);
        }
    }

    function onStyleReady() {
        createAllMarkers(isFantasy);

        // 切り替え前に開いていたポップアップを復元する
        openIds.forEach((id) => {
            const state = markerState[id];
            if (state && state.popup) {
                state.popup.addTo(mapInstance);
            }
        });

        if (typeof onComplete === "function") {
            onComplete();
        }
    }

    waitForStyleLoaded();
}

// ------------------------------------------------------------
// 指定した国の位置へ即座に移動し、ポップアップを開く
// countryId: countries 配列内の id
// ------------------------------------------------------------
export function focusCountry(countryId) {
    const country = countries.find((c) => c.id === countryId);
    const state = markerState[countryId];

    if (!country || !state) {
        return;
    }

    // アニメーションなしで一気に移動する
    mapInstance.jumpTo({
        center: country.coordinates,
        zoom: 5
    });

    // 他のポップアップを閉じてから対象のポップアップを開く
    Object.keys(markerState).forEach((id) => {
        const otherState = markerState[id];
        if (otherState.popup && otherState.popup.isOpen()) {
            otherState.popup.remove();
        }
    });

    state.popup.addTo(mapInstance);
}