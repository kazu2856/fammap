// ============================================================
// アプリのエントリポイント
// ------------------------------------------------------------
// 1. Google SheetsのCSVを読み込む
// 2. 地図を初期化する
// 3. モード切り替えボタン・国一覧パネルのUI操作を担当する
// ============================================================

import { initMap, switchMode, focusCountry, setCountries, createAllMarkers, getCountries } from "./map-controller.js";
import { getMarkerColor } from "./data.js";
import { loadCountriesFromSheet } from "./data-loader.js";

// false = 実際の地図 / true = ファンタジー
let isFantasy = false;

// 切り替え処理中の多重クリックを防ぐフラグ
let isSwitching = false;

// UI要素
const modeToggleBtn   = document.getElementById("modeToggle");
const listToggleBtn   = document.getElementById("listToggle");
const countryListPanel = document.getElementById("country-list");
const countryListItems = document.getElementById("country-list-items");

// ------------------------------------------------------------
// 国一覧パネルの内容を、現在のモードに応じて再生成する
// ------------------------------------------------------------
function renderCountryList() {
    countryListItems.innerHTML = "";

    getCountries().forEach((country) => {
        const li = document.createElement("li");

        const colorDot = document.createElement("span");
        colorDot.className = "color-dot";
        colorDot.style.backgroundColor = getMarkerColor(country.category, isFantasy);

        const label = document.createElement("span");
        const content = isFantasy ? country.popup.fantasy : country.popup.real;
        label.textContent = content.title;

        li.appendChild(colorDot);
        li.appendChild(label);

        li.addEventListener("click", () => {
            focusCountry(country.id);
        });

        countryListItems.appendChild(li);
    });
}

// ------------------------------------------------------------
// アプリの起動処理
// 1. CSVを読み込む → 2. 地図を初期化 → 3. マーカー生成
// ------------------------------------------------------------
async function start() {
    // CSVからデータを読み込む
    const countries = await loadCountriesFromSheet();
    setCountries(countries);

    // 地図を初期化し、ロード完了後にマーカーと一覧を生成する
    initMap("map", () => {
        createAllMarkers(false);
        renderCountryList();
    });
}

start();

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

    modeToggleBtn.textContent = isFantasy
        ? "実際の地図 に切り替え"
        : "fantasy-map に切り替え";

    switchMode(isFantasy, () => {
        isSwitching = false;
        modeToggleBtn.disabled = false;
        renderCountryList();
    });
});
