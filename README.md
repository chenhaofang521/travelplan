# 韩国之旅 · 单页旅行网页

这是一个纯前端的单页旅行应用，包含：简明行程、每日真实地图（Leaflet + OpenStreetMap）、每日行程时间轴、共享记账、待办清单和 PWA 离线支持。

## 项目结构

```text
korea-trip-app/
├── index.html              # 页面结构
├── styles.css              # 奶咖色系 + 暗色模式样式
├── app.js                  # 页面交互逻辑
├── data/
│   └── trip-data.js        # 行程、待办、记账配置数据（日常改这里）
├── manifest.webmanifest    # PWA 配置
├── sw.js                   # Service Worker 离线缓存
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── README.md
```

## 如何修改行程

打开 `data/trip-data.js`，按文件顶部的注释修改 `days`、`checklist`、`skincare`、`expense` 等字段即可。页面代码一般不需要改动。

- `days[].stops[].time`：时间，格式 `HH:mm`。
- `days[].stops[].timezone`：韩国行程用 `+09:00`，香港行程用 `+08:00`。
- `days[].stops[].mapQuery`：点击地点后跳转到 Naver Maps 时使用的搜索词。
- `map.cityPoints`：每天地图上出现的站点，含 `name` 与 `lat`/`lng`（经纬度）。
- `map.dayRoutes`：每一天的动线，`points` 数组按时间顺序连接站点。

## 部署到 Cloudflare Pages

1. 把这个项目推送到 GitHub 仓库。
2. 登录 Cloudflare Dashboard，进入 **Workers & Pages → Create → Pages**。
3. 选择 **Connect to Git**，选中你的仓库。
4. 配置如下：
   - **Build command**：留空（本项目无构建步骤）。
   - **Build output directory**：填 `korea-trip-app`（如果仓库根目录就是这个目录，则填 `/`；如果仓库根目录包含多个项目，则指向 `korea-trip-app`）。
5. 点击 **Save and Deploy**，部署完成后即可访问。

> 注意：本项目不需要 Node.js 或 npm 安装依赖，Cloudflare Pages 会直接托管这些静态文件。

## 共享记账如何配置

记账与待办清单默认使用浏览器 `localStorage`，只在本机保存。要开启多人跨设备同步，需要接入 [JSONBin.io](https://jsonbin.io/)：

1. 注册并登录 JSONBin.io。
2. 新建一个 Bin，名称随意，内容先填入：

   ```json
   { "expenses": [], "todos": {} }
   ```

3. 复制这个 Bin 的 **Bin ID**。
4. 在 JSONBin 的 **Access Keys** 中创建一个有读写权限的 Key，复制 Key。
5. 打开 `data/trip-data.js`，在 `expense.jsonBin` 中填入：

   ```js
   jsonBin: {
     binId: "你的 Bin ID",
     accessKey: "你的 Access Key",
     masterKey: ""
   }
   ```

6. 保存并重新部署。所有打开同一页面的家人，会读写同一个 Bin：记账和待办清单都会实时同步，对方刷新即可看到最新内容。

如果只有 `accessKey` 但写操作失败，请改用 JSONBin 的 **Master Key**，填入 `masterKey` 字段；应用会优先使用 Master Key 进行读写。

## 本地预览

直接打开 `index.html` 可以查看大部分功能；但 PWA 的 Service Worker 需要 HTTP 服务环境。建议使用任意静态服务器：

```bash
cd korea-trip-app
python3 -m http.server 8080
```

然后访问 <http://localhost:8080>。

## 注意事项

- 10月2日城南医美诊所具体地址尚未提供，数据文件里已用“地址待补”标注；拿到地址后替换 `data/trip-data.js` 中第7天对应的 `mapQuery` 和 `note` 即可。
- 每日地图使用 Leaflet 加载 OpenStreetMap 真实底图，底图瓦片需要联网才能显示；离线时行程、记账、待办等功能仍可正常使用。
- 汇率在 `data/trip-data.js` 的 `expense.rates` 中维护，可按出行当天实际汇率更新。
