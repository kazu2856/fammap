// ============================================================
// カテゴリ定義
// ------------------------------------------------------------
// カテゴリ名を追加・変更したい場合はこのオブジェクトを編集する。
// Google Sheetsの category 列の値がここのキーと一致する必要がある。
//
// 形式:
// "カテゴリ名": {
//   real:    "#rrggbb",  // 実際の地図でのピンの色
//   fantasy: "#rrggbb"   // ファンタジー世界でのピンの色
// }
// ============================================================

export const categoryColors = {
    east_asia: {
        real:    "#d64545",  // 赤系
        fantasy: "#d4af37"   // 金
    },
    europe: {
        real:    "#2c3e6b",  // 紺系
        fantasy: "#b87333"   // 銅
    },
    middle_east: {
        real:    "#c9a227",  // 金土色
        fantasy: "#e67e22"   // オレンジ
    },
    south_asia: {
        real:    "#ff9933",  // サフラン
        fantasy: "#9b59b6"   // 紫
    },
    africa: {
        real:    "#2e8b57",  // 緑
        fantasy: "#8e44ad"   // 帝国紫
    },
    oceania: {
        real:    "#16a085",  // 青緑
        fantasy: "#1abc9c"   // エメラルド
    },

    // ------------------------------------------------------------
    // カテゴリを増やす場合はここに追加する
    // ------------------------------------------------------------
    // new_category: {
    //     real:    "#rrggbb",
    //     fantasy: "#rrggbb"
    // }
};

// ------------------------------------------------------------
// カテゴリから現在のモードに応じたピンの色を返す
// 未定義のカテゴリはデフォルト色(グレー)にフォールバックする
// ------------------------------------------------------------
export function getMarkerColor(category, isFantasy) {
    const colors = categoryColors[category] ?? { real: "#888888", fantasy: "#aaaaaa" };
    return isFantasy ? colors.fantasy : colors.real;
}

// ------------------------------------------------------------
// 地図スタイルのURL定義
// ------------------------------------------------------------
export const mapStyles = {
    real:    "https://demotiles.maplibre.org/style.json",
    fantasy: "./fantasy-style.json"
};
