# Little World — English travel game

## iPad 試玩與音效

主要操作為 iPad 點按：點衣物打包、再次點按取出。可用原生城市選單選擇小地圖上密集的城市。針對 768×1024 直向及 1024×768 橫向調整衣櫃與行李箱並排顯示、至少 44px 的主要按鈕；支援 Safari，保留雙指縮放。

起飛按鈕啟動 Web Audio 合成的螺旋槳與風聲，音量漸入漸出；Sound off 同時關閉語音與音效。降落、切換到背景或離開頁面會停止引擎。依 [MDN Web Audio best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices)，在使用者點按時建立或恢復 AudioContext，適應行動裝置的音訊限制。

同 Wi-Fi 試玩需以電腦 LAN IP 啟動伺服器，例如 `python -m http.server 4174 --bind <電腦的IPv4> --directory dist`，iPad Safari 開啟 `http://<電腦的IPv4>:4174/`。127.0.0.1 只指向當下使用的裝置，不能從 iPad 連到電腦。電腦須保持開機；網路需允許裝置互連。未發佈至 GitHub Pages。

國小四年級英文旅行遊戲。15 座都市、45 組教學天氣、12 件衣物、即時打包回饋、學生公仔飛行、城市風景及本機護照章。

## 使用

`npm start` 後開啟 http://127.0.0.1:4173 。不需要安裝套件。`npm test` 驗證 45 組天氣的可通關性、錯誤衣物規則及所有素材。

靜態網站位於 `dist/`。請使用 HTTP 伺服器，勿直接開啟本機 HTML（JavaScript modules 需要 HTTP）。

## 遊戲流程

選地圖城市或 Surprise me → 看 Practice day 天氣 → Let's pack → 點擊或拖衣物到行李箱 → Check my bag → Let's fly → 抵達城市、取得章 → Next adventure。每次從上一個抵達城市出發，首次從臺北出發。選擇目前城市時會示範一小段當地降落航線。

所有主要步驟、物品、錯誤提示、目的地與景物句子使用瀏覽器英文合成語音（0.8 倍語速），另有字幕與重播按鈕。第一次使用須點擊頁面才可啟用瀏覽器聲音。需裝置有英文語音。字體離線時會自動使用系統字型。護照章儲存在 localStorage，無後端、不收學生姓名。

## 教學天氣與規則

本遊戲是教學模擬，**不是即時天氣預報**。每城市三組情境，可用 Practice day 切換。纬度和經度只作地理資訊；AI 插圖的城市位置以獨立 x/y 校準，不應當作精確 GIS 地圖。

基本衣物：T-shirt 或 sweater；pants 或 shorts；shoes 或 boots。≤10°C 要 coat、不能帶 shorts；≤0°C 還要 gloves；11–19°C 要 sweater 或 coat；≥25°C 不接受 coat、sweater、scarf、gloves。rainy 要 umbrella，snowy 要 boots，sunny 要 hat 或 sunglasses，windy 不接受 umbrella。其他適合的額外衣物可攜带，不強迫唯一答案。

## 素材

內建 imagegen 生成原創可愛 HD 圖片，generate2dmap 採地圖底圖 + 獨立城市互動點 + 航線 + 可移動角色的 runtime layers；不需要碰撞。generate2dsprite 處理學生飛機及 12 件衣物的透明背景。素材置於 `dist/assets/`，完整提示詞置於 `art-prompts/`。城市風景為教學插圖，並非照片。`pics/` 參考截图不發佈。

## GitHub Pages

將 `dist/` 的全部內容（包含 `.nojekyll`、JS、CSS、assets）放到公開儲存庫 `main` 根目錄；Settings → Pages → Deploy from a branch → main / (root)。也可以推送完整開發專案並用隨附 `.github/workflows/pages.yml` 發佈 `dist/`。

官方說明：[GitHub Pages publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、[MDN SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)。
