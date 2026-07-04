// ============================================================
// 国別データ定義
// ------------------------------------------------------------
// 国を追加したい場合は、この countries 配列に要素を追加するだけでよい。
// 各要素は以下の形式を持つ：
//
// {
//   id: "一意な識別子（文字列）",
//   coordinates: [経度, 緯度],
//   markerColor: {
//     real:    "#rrggbb",  // 実際の地図でのピンの色
//     fantasy: "#rrggbb"   // ファンタジー世界でのピンの色
//   },
//   popup: {
//     real:    { title: "実際の地図でのタイトル", description: "説明文" },
//     fantasy: { title: "ファンタジー世界でのタイトル", description: "説明文" }
//   }
// }
// ============================================================

export const countries = [
    {
        id: "japan",
        coordinates: [139.6917, 35.6895], // 東京付近
        markerColor: {
            real: "#d64545",    // 日の丸の赤
            fantasy: "#d4af37"  // 龍を象徴する金色
        },
        popup: {
            real: {
                title: "日本（Japan）",
                description:  "日本は東アジアの島国であり、古代から独自の文化と伝統を育んできた。神話の時代から続く天皇制を持ち、中世には武士が政治の中心となり、鎌倉幕府や江戸幕府などの武家政権が長く続いた。16世紀から17世紀にかけては戦国大名たちが全国統一を目指して争い、やがて徳川家康による江戸幕府が成立した。その後、約260年にわたる平和な時代を経て、1868年には明治維新が起こり、西洋技術や制度を取り入れながら急速な近代化を遂げた。現在では伝統文化と先端技術が共存する国家として世界的な影響力を持っている。"
            },
            fantasy: {
                title: "東方王国ニホン",
                description: "東の海に浮かぶ神秘の列島国家。建国神話によれば、太陽神アマテラスより授かった『天の鏡』によって初代王が国を治めたと伝えられる。かつて列島は数多くの領主たちが支配する群雄割拠の時代にあり、剣豪や陰陽師、竜騎士たちが覇権を争っていた。しかし三人の伝説的英雄によって統一への道が開かれ、やがて徳川家に相当する『徳河将軍家』が長き平和の時代を築いた。その後、外海から訪れた蒸気文明との接触を契機に『明治の覚醒』と呼ばれる大改革が始まり、魔導工学や飛空技術を取り入れて急速な発展を遂げた。現在のニホンは古来の精霊信仰と最先端の魔導技術が融合する東方最大級の先進国家として知られている。"
            }
        }
    }

    ,{
        id: "china",
        coordinates: [116.4074, 39.9042], // 北京
        markerColor: {
            real: "#c0392b",    // 国旗の赤
            fantasy: "#2ecc71"  // 龍脈を象徴する翡翠色
        },
        popup: {
            real: {
                title: "中国 (China)",
                description: "中国は世界最古級の文明圏の一つであり、黄河流域で栄えた古代国家から現在まで長い歴史を持つ。紀元前221年には秦の始皇帝が戦国時代を終わらせ、中国を初めて統一した。その後も漢・唐・宋・明など数多くの王朝が興亡を繰り返し、シルクロードを通じて東西交易の中心として栄えた。広大な領土と人口を背景に、政治・文化・技術の面で東アジア全体へ大きな影響を与えてきた。"
            },

            fantasy: {
                title: "龍華帝国",
                description: "かつて龍脈を巡って争っていた七つの王国を、始祖皇帝シンが天龍の加護を得て統一したと伝えられる。帝国は大地を流れる龍脈を利用した『龍脈交易路』を整備し、西方の諸国と盛んに交易を行った。歴代皇帝は天龍の意志を受け継ぐ存在とされ、巨大な宮殿都市と数多くの魔導技術を築き上げた。現代でも龍華帝国は世界最大の人口と豊かな文化を誇る東方最大の超大国である。"
            }
        }
    }

    ,{
        id: "united_kingdom",
        coordinates: [-0.1276, 51.5072], // ロンドン
        markerColor: {
            real: "#2c3e6b",    // ユニオンジャックの紺
            fantasy: "#b87333"  // 蒸気機関の銅色
        },
        popup: {
            real: {
                title: "イギリス (United Kingdom)",
                description: "産業革命を主導し、大英帝国として世界中に大きな影響を与えた海洋国家。"
            },

            fantasy: {
                title: "蒸気王国ブリタニア",
                description: "魔導蒸気機関を発明し、巨大飛空艦隊で七つの海を支配した空海帝国。"
            }
        }
    }

    ,{
        id: "united_states",
        coordinates: [-77.0369, 38.9072], // ワシントンD.C.
        markerColor: {
            real: "#3b5998",    // 星条旗の青
            fantasy: "#a8a8a8"  // 星条連邦の銀
        },
        popup: {
            real: {
                title: "アメリカ合衆国 (USA)",
                description: "独立戦争によって建国され、20世紀以降は世界有数の経済・軍事大国となった。"
            },

            fantasy: {
                title: "星条連邦アメリア",
                description: "自由の魔法を掲げる新興国家。空と海を越えて開拓を続ける冒険者たちの連邦。"
            }
        }
    }

    ,{
        id: "france",
        coordinates: [2.3522, 48.8566], // パリ
        markerColor: {
            real: "#4169c4",    // 国旗の青
            fantasy: "#e066a6"  // 百合王国を象徴するピンク
        },
        popup: {
            real: {
                title: "フランス (France)",
                description: "フランス革命を経て近代民主主義の発展に大きな影響を与えた国家。"
            },

            fantasy: {
                title: "百合王国フランシア",
                description: "革命騎士団が太陽王朝を打倒し、芸術と魔法が花開いた王国。"
            }
        }
    }

    ,{
        id: "germany",
        coordinates: [13.4050, 52.5200], // ベルリン
        markerColor: {
            real: "#2c2c2c",    // 国旗の黒
            fantasy: "#7f8c8d"  // 鉄鋼帝国の鉄灰色
        },
        popup: {
            real: {
                title: "ドイツ (Germany)",
                description: "神聖ローマ帝国から統一ドイツへ発展し、工業と科学技術で世界をリードした。"
            },

            fantasy: {
                title: "鉄鋼帝国ゲルマニア",
                description: "鋼鉄の巨人兵と魔導工房を有する機械文明国家。"
            }
        }
    }

    ,{
        id: "mongolia",
        coordinates: [106.9057, 47.8864], // ウランバートル
        markerColor: {
            real: "#c0392b",    // 国旗の赤
            fantasy: "#16a085"  // 草原と空を思わせる青緑
        },
        popup: {
            real: {
                title: "モンゴル (Mongolia)",
                description: "チンギス・ハンによってユーラシア大陸を席巻する大帝国を築いた。"
            },

            fantasy: {
                title: "草原騎竜国モンガル",
                description: "騎竜軍団が世界を駆け巡り、多くの王国を従えた伝説の遊牧国家。"
            }
        }
    }

    ,{
        id: "egypt",
        coordinates: [31.2357, 30.0444], // カイロ
        markerColor: {
            real: "#c9a227",    // 砂漠を思わせる金土色
            fantasy: "#e67e22"  // 太陽神を象徴するオレンジ
        },
        popup: {
            real: {
                title: "エジプト (Egypt)",
                description: "ナイル川流域に古代エジプト文明が栄え、巨大なピラミッドを建造した。"
            },

            fantasy: {
                title: "太陽神王国ケメト",
                description: "神々の力を宿す巨大な石造遺跡と不死の王たちが支配する砂漠国家。"
            }
        }
    }

    ,{
        id: "italy",
        coordinates: [12.4964, 41.9028], // ローマ
        markerColor: {
            real: "#2e8b57",    // 国旗の緑
            fantasy: "#8e44ad"  // 聖鷲帝国を象徴する紫
        },
        popup: {
            real: {
                title: "イタリア (Italy)",
                description: "古代ローマ帝国の中心地として地中海世界を支配した歴史を持つ。"
            },

            fantasy: {
                title: "聖鷲帝国ロマニア",
                description: "神鳥の加護を受けた軍団が世界を征服した伝説の帝国。"
            }
        }
    }

    ,{
        id: "india",
        coordinates: [77.2090, 28.6139], // ニューデリー
        markerColor: {
            real: "#ff9933",    // 国旗のサフラン色
            fantasy: "#9b59b6"  // 神象王朝を象徴する紫
        },
        popup: {
            real: {
                title: "インド (India)",
                description: "インダス文明やムガル帝国など、多様な文化と宗教を育んできた。"
            },

            fantasy: {
                title: "神象王朝インディラ",
                description: "神獣と共に生きる賢者たちが築いた魔法と叡智の王国。"
            }
        }
    }

    ,{
        id: "greece",
        coordinates: [23.7275, 37.9838], // アテネ
        markerColor: {
            real: "#3498db",    // 国旗の青
            fantasy: "#d4af37"  // 神託・大理石を思わせる金
        },
        popup: {
            real: {
                title: "ギリシャ (Greece)",
                description: "古代ギリシャ文明は哲学・数学・民主政治などに大きな影響を与えた。"
            },

            fantasy: {
                title: "神託都市連邦ヘレシア",
                description: "神々の声を聞く神官たちが統治する学術と英雄の都。"
            }
        }
    }
];

// ------------------------------------------------------------
// 地図スタイルのURL定義
// ------------------------------------------------------------
export const mapStyles = {
    real: "https://demotiles.maplibre.org/style.json",
    fantasy: "./fantasy-style.json"
};

// ------------------------------------------------------------
// 指定した国データから、現在のモードに応じたポップアップHTMLを生成する
// ------------------------------------------------------------
export function buildPopupHTML(country, isFantasy) {
    const content = isFantasy ? country.popup.fantasy : country.popup.real;
    return `
        <h3>${content.title}</h3>
        <p>${content.description}</p>
    `;
}

// ------------------------------------------------------------
// 指定した国データから、現在のモードに応じたマーカーの色を取得する
// ------------------------------------------------------------
export function getMarkerColor(country, isFantasy) {
    return isFantasy ? country.markerColor.fantasy : country.markerColor.real;
}

// ------------------------------------------------------------
// 指定した国データから、現在のモードに応じた国名（タイトル）のみを取得する
// 一覧パネルの表示に使用する
// ------------------------------------------------------------
export function getCountryTitle(country, isFantasy) {
    return isFantasy ? country.popup.fantasy.title : country.popup.real.title;
}