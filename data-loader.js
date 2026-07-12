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

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSd9ckheCdH86wq7XjwLXerBElPGqjPoJLrgjzPRTnmJmAqPD-5ZRs_ckQiQicCysiL0ft35VdFvhC-/pub?output=csv";

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
//   description_real, description_fantasy, category
// ------------------------------------------------------------
function rowToCountry(row) {
    return {
        id:          row["id"],
        coordinates: [parseFloat(row["lng"]), parseFloat(row["lat"])],
        category:    row["category"],
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
// Google SheetsのCSVを取得し、countries配列を返す
// 失敗した場合は空配列を返す
// ------------------------------------------------------------
export async function loadCountriesFromSheet() {
    if (SHEET_CSV_URL === "ここにGoogle SheetsのCSV公開URLを貼り付ける") {
        console.warn("[data-loader] SHEET_CSV_URL が未設定です。data-loader.js を編集してURLを設定してください。");
        return [];
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
        console.error("[data-loader] CSVの読み込みに失敗しました:", err);
        return [];
    }
}
