## 安裝

Node.js 版本建議為：`18.16.0` 以上

### 安裝套件

```bash
npm install
```

### 環境變數設定

請在終端機輸入 `cp .env.example .env` 來複製 .env.example 檔案，並依據 `.env` 內容調整相關欄位。

### 運行專案

```bash
npm run dev
```

### 開啟專案

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:3005/
```

## Swagger

> 當你還原專案時，就已經自動產生 Swagger 文件了。

產生 Swagger 文件

```bash
npm run swagger-autogen
```

在瀏覽器網址列輸入以下即可看到畫面

```bash
http://localhost:3005/swagger
```

-   參考資料 : [使用 Swagger 自動生成 API 文件](https://israynotarray.com/nodejs/20201229/1974873838/)

## 資料夾說明

```txt
freyja
├─ develop                  // 開發工具、腳本
│  ├─ build.js              // 使用 esbuild 來編譯、打包專案
│  ├─ swagger.js            // 產生 Swagger 文件
│  └─ swagger_output.json   // Swagger 文件，會由 swagger.js 產生
├─ public                   // 靜態資源放置處
├─ src
│  ├─ app                   // 入口點
│  ├─ controllers           // 控制器
│  ├─ middlewares           // 中間件
│  ├─ models                // 資料庫模型
│  ├─ routes                // 路由
│  ├─ utils                 // 工具
│  └─ reference.d.ts        // 全局型別定義
├─ .env.example             // 環境變數範例
├─ .gitignore               // Git 忽略檔案
├─ .prettierrc.json         // Prettier 設定檔
├─ Dockerfile               // Docker 設定檔
├─ package-lock.json
├─ package.json
└─ tsconfig.json
```

## 專案技術

-   node.js v20.8.9
-   tsx v3.14.0
-   esbuild v0.19.5
-   express v4.18.2
-   mongoose v7.6.3
-   jsonwebtoken v9.0.2

## 專案指令列表

```bash
# 開發指令 : 使用 tsx watch 來監聽檔案變化，並且自動編譯成 js 檔案，適用於開發環境
npm run dev

# 打包指令 : 使用 esbuild 來編譯、打包專案，適用於正式環境
npm run build

# 啟動指令 : 使用 node 來啟動專案，適用於正式環境
npm run start

# 產生 Swagger 文件指令 : 用來產生 Swagger 文件
npm run swagger-autogen
```
