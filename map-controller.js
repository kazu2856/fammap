// ============================================================
// 地図コントローラ
// ------------------------------------------------------------
// 地図の初期化、マーカーの生成・破棄、スタイル切り替えを担当する。
// UI（ボタンなど）からはこのモジュールが提供する関数だけを呼び出す。
//
// countries データは外部(main.js)から setCountries() で渡す。
// データソース(CSVやハードコード)をこのモジュールは意識しない。
// ============================================================

import { mapStyles, getMarkerColor } from "./data.js";

// 現在の国データ(main.jsからsetCountriesで渡される)
let countries = [];

// 現在のマーカーとポップアップを保持する内部状態
// { id: { marker, popup } } の形式
const markerState = {};

let mapInstance = null;

// ------------------------------------------------------------
// 国データをセットする(main.jsから呼び出す)
// ------------------------------------------------------------
export function setCountries(data) {
    countries = data;
}

// ------------------------------------------------------------
// 地図インスタンスを初期化する
// onLoad: 地図ロード完了時に呼ばれるコールバック
// ------------------------------------------------------------
export function initMap(containerId, onLoad) {
    mapInstance = new maplibregl.Map({
        container: containerId,
        style: mapStyles.real,
        center: [139.6917, 35.6895],
        zoom: 2
    });

    mapInstance.addControl(new maplibregl.NavigationControl());

    mapInstance.on("load", () => {
        if (typeof onLoad === "function") {
            onLoad();
        }
    });

    return mapInstance;
}

// ------------------------------------------------------------
// ポップアップのHTMLを生成する
// isFantasy時は url_fantasy、realモード時は url を使用する
// ------------------------------------------------------------
function buildPopupHTML(country, isFantasy) {
    const content = isFantasy ? country.popup.fantasy : country.popup.real;
    const url     = isFantasy ? (country.url_fantasy ?? "") : (country.url ?? "");

    const linkHTML = url
        ? `<a class="popup-link" href="${url}" target="_blank" rel="noopener noreferrer">詳しく見る →</a>`
        : "";

    return `
        <h3>${content.title}</h3>
        <p>${content.description}</p>
        ${linkHTML}
    `;
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
            color: getMarkerColor(country.category, isFantasy)
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
        if (state.popup) state.popup.remove();
        if (state.marker) state.marker.remove();
        delete markerState[id];
    });
}

// ------------------------------------------------------------
// 開いているポップアップのIDを返す
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

    mapInstance.setStyle(isFantasy ? mapStyles.fantasy : mapStyles.real);

    function waitForStyleLoaded() {
        if (mapInstance.isStyleLoaded()) {
            onStyleReady();
        } else {
            mapInstance.once("styledata", waitForStyleLoaded);
        }
    }

    function onStyleReady() {
        createAllMarkers(isFantasy);

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
// 指定した国の位置へ flyTo で移動し、ポップアップを開く
// ------------------------------------------------------------
export function focusCountry(countryId) {
    const country = countries.find((c) => c.id === countryId);
    const state = markerState[countryId];

    if (!country || !state) return;

    mapInstance.flyTo({
        center: country.coordinates,
        zoom: 5,
        speed: 1.2,
        curve: 1.4
    });

    Object.keys(markerState).forEach((id) => {
        const otherState = markerState[id];
        if (otherState.popup && otherState.popup.isOpen()) {
            otherState.popup.remove();
        }
    });

    mapInstance.once("moveend", () => {
        state.popup.addTo(mapInstance);
    });
}

// ------------------------------------------------------------
// 現在の countries データを返す(一覧パネルの描画に使用)
// ------------------------------------------------------------
export function getCountries() {
    return countries;
}
