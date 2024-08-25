# amber-heat-stress-warning-data | 黃色工作暑熱警告收集軟件

此自由開源軟件旨在從新聞發布網站自動收集「黃色工作暑熱警告」的信息，包括日期、生效時間和結束時間。透過自動化過程，軟件可協助用戶及時了解工作環境中的熱壓力風險，提高安全性。

希望它能幫助你掌握基礎的網頁抓取技術，增進對 Typescript 和 SQLite 的理解。歡迎大家基於此項目進行擴展實驗，探索更多可能性！

![Scatter plot showing the daily duration of amber heat stress warnings over time. The x-axis represents dates from January 2023 to August 2024, and the y-axis represents duration in hours. Two clusters of green dots are visible: one around mid-2023 and another around mid-2024, indicating periods with more frequent warnings.](./screenshot.webp 'Daily Duration of Amber Heat Stress Warnings with Current Date Marked (Jan 2023 - Aug 2025)')

## 功能特色

- 自動抓取和更新勞工處的黃色工作暑熱警告
- 收集警告的日期、生效時間和結束時間
- 支援多種平台，易於安裝和使用

## Tech Stack

- Typescript (Node.js)
- Playwright (Scrapping)
- Sqlite (Database)

Todo:

- ts-liveview (Web Portal)

## License

This project is licensed with [BSD-2-Clause](./LICENSE)

This is free, libre, and open-source software. It comes down to four essential freedoms [[ref]](https://seirdy.one/2021/01/27/whatsapp-and-the-domestication-of-users.html#fnref:2):

- The freedom to run the program as you wish, for any purpose
- The freedom to study how the program works, and change it so it does your computing as you wish
- The freedom to redistribute copies so you can help others
- The freedom to distribute copies of your modified versions to others
