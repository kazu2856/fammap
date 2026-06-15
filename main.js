// ============================================================
// アプリのエントリポイント
// ------------------------------------------------------------
// 地図の初期化と、モード切り替えボタンの操作を担当する。
// ============================================================

import { initMap, switchMode, focusCountry } from "./map-controller.js";
import { countries, getMarkerColor, getCountryTitle } from "./data.js";

// false = 実際の地図 / true = ファンタジー
let isFantasy = false;

// 切り替え処理中の多重クリックを防ぐフラグ
let isSwitching = false;

// 地図を初期化
initMap("map");

// モード切り替えボタンの取得
const modeToggleBtn = document.getElementById("modeToggle");

// 国一覧関連の要素
const listToggleBtn = document.getElementById("listToggle");
const countryListPanel = document.getElementById("country-list");
const countryListItems = document.getElementById("country-list-items");

// ------------------------------------------------------------
// 国一覧パネルの内容を、現在のモードに応じて再生成する
// ------------------------------------------------------------
function renderCountryList() {
    countryListItems.innerHTML = "";

    countries.forEach((country) => {
        const li = document.createElement("li");

        // 国ごとの色を示す丸印
        const colorDot = document.createElement("span");
        colorDot.className = "color-dot";
        colorDot.style.backgroundColor = getMarkerColor(country, isFantasy);

        const label = document.createElement("span");
        label.textContent = getCountryTitle(country, isFantasy);

        li.appendChild(colorDot);
        li.appendChild(label);

        // クリックでその国の位置へジャンプし、ポップアップを開く
        li.addEventListener("click", () => {
            focusCountry(country.id);
        });

        countryListItems.appendChild(li);
    });
}

// 初回表示
renderCountryList();

// ------------------------------------------------------------
// 国一覧パネルの開閉
// ------------------------------------------------------------
listToggleBtn.addEventListener("click", () => {
    countryListPanel.classList.toggle("hidden");
});

// ------------------------------------------------------------
// モード切り替えボタンの処理
// ------------------------------------------------------------
modeToggleBtn.addEventListener("click", () => {
    if (isSwitching) return;

    isSwitching = true;
    modeToggleBtn.disabled = true;

    isFantasy = !isFantasy;

    // ボタンのラベルを更新
    modeToggleBtn.textContent = isFantasy
        ? "実際の地図 に切り替え"
        : "fantasy-map に切り替え";

    // 紙テクスチャオーバーレイの表示/非表示を切り替え
    document.body.classList.toggle("fantasy-mode", isFantasy);

    // 地図のスタイルとマーカー内容を切り替え
    switchMode(isFantasy, () => {
        isSwitching = false;
        modeToggleBtn.disabled = false;

        // モードに応じて国一覧の表示内容も更新
        renderCountryList();
    });
});