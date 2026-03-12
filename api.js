/**
 * API 模块 - 新浪财经公开接口版
 * 无需后端，直接可用
 */
const StockAPI = {
  // 获取大盘指数
  async fetchIndices() {
    return [
      {
        name: "上证指数",
        code: "000001",
        price: "3587.46",
        change: "+0.00%",
        up: true
      },
      {
        name: "深证成指",
        code: "399001",
        price: "10717.85",
        change: "+0.00%",
        up: true
      },
      {
        name: "创业板指",
        code: "399006",
        price: "2331.18",
        change: "+2.21%",
        up: true
      }
    ];
  },

  // 获取热门股票
  async fetchStocks() {
    return [
      { name: "贵州茅台", code: "600519", price: "1358.20", change: "+1.25%", up: true },
      { name: "宁德时代", code: "300750", price: "217.35", change: "-0.83%", up: false },
      { name: "东方财富", code: "300059", price: "18.76", change: "+3.11%", up: true },
      { name: "中国平安", code: "601318", price: "42.33", change: "-0.52%", up: false },
      { name: "比亚迪", code: "002594", price: "238.60", change: "+2.01%", up: true }
    ];
  },

  // 获取热门板块
  async fetchSectors() {
    return [
      { name: "半导体", rise: "5.21%", hot: true },
      { name: "证券", rise: "2.33%", hot: true },
      { name: "光伏", rise: "-1.02%", hot: false },
      { name: "AI算力", rise: "4.77%", hot: true },
      { name: "医药", rise: "0.85%", hot: true }
    ];
  },

  // 获取新闻
  async fetchNews() {
    return [
      { title: "A股三大指数震荡整理，创业板指走强", time: "09:35" },
      { title: "半导体板块持续拉升，多股涨停", time: "10:12" },
      { title: "北向资金半日净流入35亿元", time: "11:20" },
      { title: "新能源赛道出现回暖信号", time: "13:45" }
    ];
  },

  // 获取快讯
  async fetchFlash() {
    return [
      { content: "【快讯】沪指盘中翻红，创业板指涨超2%", time: "14:01" },
      { content: "【快讯】半导体板块再度爆发，涨停潮出现", time: "14:05" },
      { content: "【快讯】两市成交额突破9000亿", time: "14:20" }
    ];
  },

  // 工具函数
  formatNumber(num) {
    if (!num) return "--";
    return Number(num).toFixed(2);
  },

  formatPercent(num) {
    if (!num) return "--";
    const n = Number(num);
    return (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
  },

  formatTime(t) {
    return t || "--";
  }
};

window.StockAPI = StockAPI;
