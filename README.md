# 股票热点资讯网站

一个简洁美观的股票热点资讯网站，采用深色主题设计，支持响应式布局，手机电脑都能完美显示。

## 功能特点

- 📈 **实时行情** - 展示主要指数和热门个股，5 秒自动刷新
- 🔥 **热门板块** - 展示领涨板块，按涨跌幅排序
- 📰 **个股资讯** - 最新个股相关新闻
- ⚡ **财经快讯** - 7x24 小时滚动财经快讯

## 技术栈

- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **后端**: Node.js (HTTP 服务)
- **数据源**: 新浪财经 API + 模拟数据

## 项目结构

```
stock-news/
├── index.html          # 主页面
├── css/
│   └── style.css       # 深色主题样式
├── js/
│   ├── api.js          # API 请求模块
│   ├── components.js   # UI 渲染组件
│   └── app.js          # 应用主逻辑
├── server/
│   └── server.js       # Node.js 后端服务
└── package.json        # 项目配置
```

## 快速开始

### 方式一：使用 Node.js 后端（推荐）

1. 确保已安装 Node.js (v14+)

2. 启动后端服务：
```bash
cd stock-news
npm start
```

3. 打开浏览器访问：http://localhost:3000

### 方式二：仅使用前端（数据可能受 CORS 限制）

直接用浏览器打开 `index.html` 文件即可。

## API 端点

| 端点 | 描述 |
|------|------|
| GET /api/indices | 主要指数数据 |
| GET /api/stocks | 热门个股数据 |
| GET /api/sectors | 热门板块数据 |
| GET /api/news | 个股资讯 |
| GET /api/flash | 财经快讯 |
| GET /health | 健康检查 |

## 自定义配置

### 修改刷新间隔

编辑 `js/app.js` 中的 `AppConfig` 对象：

```javascript
const AppConfig = {
    REFRESH_INTERVAL: 5000,        // 行情刷新间隔（毫秒）
    FLASH_REFRESH_INTERVAL: 10000  // 快讯刷新间隔（毫秒）
};
```

### 修改服务端口

编辑 `server/server.js` 中的 `PORT` 常量：

```javascript
const PORT = 3000;  // 修改为你想要的端口
```

## 响应式设计

- **桌面端** (>768px): 网格布局，多列显示
- **平板端** (480px-768px): 自适应单列布局
- **手机端** (<480px): 优化触摸体验，紧凑布局

## 注意事项

1. 本应用使用新浪财经公开 API 获取实时行情数据
2. 部分数据为模拟数据，仅供学习参考
3. 实际使用建议接入正规财经数据源
4. 信息仅供参考，不构成投资建议

## 开发说明

- 代码已添加详细中文注释
- 采用模块化设计，便于维护扩展
- 深色主题配色，专业金融风格
- 支持价格闪烁动画效果

## License

MIT
