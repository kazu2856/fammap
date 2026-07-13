// ============================================================
// Google Sheets CSV ローダー
// ------------------------------------------------------------
// Google SheetsをCSV形式で公開し、そのURLを指定することで
// 地点データを読み込む。
//
// Google SheetsのCSV公開手順:
//   1. スプレッドシートを開く
//   2. ファイル → 共有 → ウェブに公開
//   3. 「リンク」タブで形式を「カンマ区切り形式(.csv)」に変更
//   4. 「公開」を押してURLをコピー
//   5. 下の SHEET_CSV_URL にそのURLを貼り付ける
// ============================================================

const SHEET_CSV_URL = "ここにGoogle SheetsのCSV公開URLを貼り付ける";

// ------------------------------------------------------------
// CSVテキストを行・列の2次元配列にパースする
// ダブルクォートで囲まれたカンマ・改行も正しく処理する
// ------------------------------------------------------------
function parseCSV(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];

        if (inQuote) {
            if (ch === '"' && next === '"') {
                // エスケープされたダブルクォート
                cell += '"';
                i++;
            } else if (ch === '"') {
                inQuote = false;
            } else {
                cell += ch;
            }
        } else {
            if (ch === '"') {
                inQuote = true;
            } else if (ch === ",") {
                row.push(cell.trim());
                cell = "";
            } else if (ch === "\n" || (ch === "\r" && next === "\n")) {
                row.push(cell.trim());
                rows.push(row);
                row = [];
                cell = "";
                if (ch === "\r") i++; // \r\n の \n をスキップ
            } else {
                cell += ch;
            }
        }
    }

    // 最終行の処理
    if (cell !== "" || row.length > 0) {
        row.push(cell.trim());
        rows.push(row);
    }

    return rows;
}

// ------------------------------------------------------------
// 2次元配列を {ヘッダー名: 値} のオブジェクト配列に変換する
// ------------------------------------------------------------
function toObjectArray(rows) {
    if (rows.length < 2) return [];
    const headers = rows[0];
    return rows.slice(1).filter((row) => row.some((cell) => cell !== "")).map((row) => {
        const obj = {};
        headers.forEach((header, i) => {
            obj[header] = row[i] ?? "";
        });
        return obj;
    });
}

// ------------------------------------------------------------
// CSVの1行を map-controller.js が扱う country オブジェクトに変換する
//
// Google Sheetsの列名(ヘッダー)は以下を想定する:
//   id, name_real, name_fantasy, lat, lng,
//   description_real, description_fantasy, category,
//   url, url_fantasy
// ------------------------------------------------------------
function rowToCountry(row) {
    return {
        id:          row["id"],
        coordinates: [parseFloat(row["lng"]), parseFloat(row["lat"])],
        category:    row["category"],
        url:         row["url"]         ?? "",  // realモードの詳細ページURL
        url_fantasy: row["url_fantasy"] ?? "",  // fantasyモードの詳細ページURL
        popup: {
            real: {
                title:       row["name_real"],
                description: row["description_real"]
            },
            fantasy: {
                title:       row["name_fantasy"],
                description: row["description_fantasy"]
            }
        }
    };
}

// ------------------------------------------------------------
// フォールバックデータ
// SHEET_CSV_URL が未設定の場合にこのデータを使用する。
// 国を追加する際はスプレッドシートに行を追加し、
// 対応する紹介HTMLを作成した上で url 列にパスを設定する。
// スプレッドシートの準備ができたら SHEET_CSV_URL にURLを
// 設定すれば自動的にCSV側に切り替わる。
// ------------------------------------------------------------
const FALLBACK_COUNTRIES = [
    {
        id:          "japan",
        coordinates: [139.6917, 35.6895],
        category:    "east_asia",
        url:         "japan.html",
        url_fantasy: "japan-fantasy.html",
        popup: {
            real: {
                title:       "日本（Japan）",
                description: "古代から続く島国で、武家政権や明治維新など多様な歴史を持つ。"
            },
            fantasy: {
                title:       "東方王国ニホン",
                description: "霊峰フジヤマを守護する龍族と契約した侍の国。"
            }
        }
    }

    // 国を追加する場合はここにオブジェクトを追加する
    // スプレッドシート接続後はこのデータは使われなくなる
    ,{
        id:          "united_kingdom",
        coordinates: [-0.1276, 51.5072],
        category:    "europe",
        url:         "uk.html",
        url_fantasy: "uk-fantasy.html",
        popup: {
            real: {
                title:       "イギリス (United Kingdom)",
                description: "産業革命を主導し、大英帝国として世界中に大きな影響を与えた海洋国家。"
            },
            fantasy: {
                title:       "蒸気王国ブリタニア",
                description: "魔導蒸気機関を発明し、巨大飛空艦隊で七つの海を支配した空海帝国。"
            }
        }
    }
    ,{
        id:          "germany",
        coordinates: [13.4050, 52.5200],
        category:    "europe",
        url:         "germany.html",
        url_fantasy: "germany-fantasy.html",
        popup: {
            real: {
                title:       "ドイツ (Germany)",
                description: "神聖ローマ帝国から統一ドイツへ発展し、工業と科学技術で世界をリードした。"
            },
            fantasy: {
                title:       "鉄鋼帝国ゲルマニア",
                description: "鋼鉄の巨人兵と魔導工房を有する機械文明国家。"
            }
        }
    }
    ,{
        id:          "italy",
        coordinates: [12.4964, 41.9028],
        category:    "europe",
        url:         "italy.html",
        url_fantasy: "italy-fantasy.html",
        popup: {
            real: {
                title:       "イタリア (Italy)",
                description: "古代ローマ帝国の中心地として地中海世界を支配した歴史を持つ。"
            },
            fantasy: {
                title:       "聖鷲帝国ロマニア",
                description: "神鳥の加護を受けた軍団が世界を征服した伝説の帝国。"
            }
        }
    }
];

// ------------------------------------------------------------
// Google SheetsのCSVを取得し、countries配列を返す
// SHEET_CSV_URL が未設定またはCSV取得に失敗した場合は
// フォールバックデータを返す
// ------------------------------------------------------------
export async function loadCountriesFromSheet() {
    if (SHEET_CSV_URL === "ここにGoogle SheetsのCSV公開URLを貼り付ける") {
        console.info("[data-loader] SHEET_CSV_URL が未設定のため、フォールバックデータを使用します。");
        return FALLBACK_COUNTRIES;
    }

    try {
        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const text = await response.text();
        const rows = parseCSV(text);
        const objects = toObjectArray(rows);
        return objects.map(rowToCountry);
    } catch (err) {
        console.error("[data-loader] CSVの読み込みに失敗しました。フォールバックデータを使用します:", err);
        return FALLBACK_COUNTRIES;
    }
}
