# Book System Frontend

這是一個基於 Vue.js 的圖書管理系統前端專案，使用 Element Plus 作為 UI 框架，並通過 Axios 與後端 API 進行通信。在啟動前端前，請先確保後端服務已經啟動。

## 環境設置

1. node
建議用nvm，指定版本至node v23.7.0
2. Vue 3.x

## 安裝

首先，clone此專案到本地：

```bash
git clone https://github.com/eddie055165/book-system-frontend.git
cd book-system-front
```

然後，安裝依賴：

```bash
npm install
```

## 運行

在開發模式下運行應用：

```bash
npm run serve
```

應用將在 `http://localhost:8081` 上運行。

## 構建

構建生產環境的應用：

```bash
npm run build
```

構建的文件將位於 `dist` 文件夾中。


## 功能

- 用戶登入和註冊
- 圖書借閱和歸還
- 圖書狀態篩選
- 用戶信息管理

