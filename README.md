# Little World — English travel game

## iPad 試玩與音效

主要操作為 iPad 點按：點衣物打包、再次點按取出。可用原生城市選單選擇小地圖上密集的城市。針對 768×1024 直向及 1024×768 橫向調整衣櫃與行李箱並排顯示、至少 44px 的主要按鈕；支援 Safari，保留雙指縮放。

起飛按鈕啟動 Web Audio 合成的螺旋槳與風聲，音量漸入漸出；Sound off 同時關閉語音與音效。降落、切換到背景或離開頁面會停止引擎。依 [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)，在使用者點按時建立或恢復 AudioContext，適應行動裝置的音訊限制。

同 Wi-Fi 試玩需以電腦 LAN IP 啟動伺服器，例如 `python -m http.server 4174 --bind <電腦的IPv4> --directory dist`，iPad Safari 開啟 `http://<電腦的IPv4>:4174/`。127.0.0.1 只指向當下使用的裝置，不能從 iPad 連到電腦。電腦須保持開機；網路需允許裝置互連。正式網站：https://tyctc128.github.io/little-world-english/ 。

國小四年級英文旅行遊戲。15 座都市、45 組教學天氣、12 件衣物、即時打包回饋、學生公仔飛行、城市風景及本機護照章。

## 使用

`npm start` 後開啟 http://127.0.0.1:4173 。不需要安裝套件。`npm test` 驗證 45 組天氣的可通關性、錯誤衣物規則及所有素材。

靜態網站位於 `dist/`。請使用 HTTP 伺服器，勿直接開啟本機 HTML（JavaScript modules 需要 HTTP）。

## 遊戲流程

選地圖城市或 Surprise me → 看 Practice day 天氣 → Let's pack → 點擊或拖衣物到行李箱 → Check my bag → Let's fly → 抵達城市、取得章 → Next adventure。每次從上一個抵達城市出發，首次從臺北出發。選擇目前城市時會從該城市起飛、繞行並返回原點。

所有主要步驟、物品、錯誤提示、目的地與景物句子使用瀏覽器英文合成語音（0.8 倍語速），另有字幕與重播按鈕。第一次使用須點擊頁面才可啟用瀏覽器聲音。需裝置有英文語音。字體離線時會自動使用系統字型。護照章儲存在 localStorage，無後端、不收學生姓名。

## 教學天氣與規則

本遊戲是教學模擬，**不是即時天氣預報**。每城市三組情境，可用 Practice day 切換。地圖恢復原本手繪插畫；map-anchors.js 保存依照插畫海岸線校準的城市位置，城市標記與飛機起降點共用這組座標。真實經緯度保留作城市資訊；插畫不是等比例地理投影。航線弧線為教學動畫，不代表實際航班或最短航路。

基本衣物：T-shirt 或 sweater；pants 或 shorts；shoes 或 boots。≤10°C 要 coat、不能帶 shorts；≤0°C 還要 gloves；11–19°C 要 sweater 或 coat；≥25°C 不接受 coat、sweater、scarf、gloves。rainy 要 umbrella，snowy 要 boots，sunny 要 hat 或 sunglasses，windy 不接受 umbrella。其他適合的額外衣物可攜带，不強迫唯一答案。

## 素材

內建 imagegen 生成原創可愛 HD 圖片，generate2dmap 採地圖底圖 + 獨立城市互動點 + 航線 + 可移動角色的 runtime layers；不需要碰撞。generate2dsprite 處理學生飛機及 12 件衣物的透明背景。素材置於 `dist/assets/`，完整提示詞置於 `art-prompts/`。城市風景為教學插圖，並非照片。`pics/` 參考截图不發佈。

## GitHub Pages

正式網址：https://tyctc128.github.io/little-world-english/

原始碼存於 `main`；網站由 `gh-pages` 分支根目錄發佈。更新遊戲後先執行 `npm test` 並提交變更，再執行 `git subtree split --prefix dist -b pages-release`、`git push origin main pages-release:gh-pages`、`git branch -D pages-release`。此方式不需要額外 workflow 授權。`docs/pages-workflow.example.yml` 保留可選的 GitHub Actions 範例（目前未啟用）。

官方說明：[GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)。
