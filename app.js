/**
 * 主应用逻辑 - 股票热点资讯应用入口
 * 负责初始化、数据轮询、事件处理等
 */

// 应用配置
const AppConfig = {
    // 数据刷新间隔（毫秒）
    REFRESH_INTERVAL: 5000,
    // 快讯刷新间隔（毫秒）
    FLASH_REFRESH_INTERVAL: 10000,
    // 当前活跃的板块
    activeSection: 'market'
};

/**
 * 应用主类
 */
class StockApp {
    constructor() {
        this.refreshTimer = null;
        this.flashTimer = null;
        this.isRefreshing = false;

        // 绑定 this 上下文
        this.init = this.init.bind(this);
        this.refreshAll = this.refreshAll.bind(this);
        this.switchSection = this.switchSection.bind(this);
        this.handleRefreshClick = this.handleRefreshClick.bind(this);
    }

    /**
     * 初始化应用
     */
    init() {
        console.log('股票热点资讯应用初始化中...');

        // 绑定导航事件
        this.bindNavEvents();

        // 绑定刷新按钮事件
        this.bindRefreshButton();

        // 首次加载数据
        this.refreshAll();

        // 启动定时刷新
        this.startAutoRefresh();

        console.log('应用初始化完成');
    }

    /**
     * 绑定导航栏切换事件
     */
    bindNavEvents() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const section = btn.dataset.section;
                this.switchSection(section);
            });
        });
    }

    /**
     * 绑定刷新按钮事件
     */
    bindRefreshButton() {
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', this.handleRefreshClick);
        }
    }

    /**
     * 切换显示板块
     * @param {string} section - 板块 ID
     */
    switchSection(section) {
        // 更新导航按钮状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.section === section);
        });

        // 更新内容区域显示
        document.querySelectorAll('.section').forEach(sec => {
            sec.classList.toggle('active', sec.id === section);
        });

        AppConfig.activeSection = section;
        console.log(`切换到板块：${section}`);

        // 如果切换到快讯板块，立即刷新一次
        if (section === 'flash') {
            this.loadFlash();
        }
    }

    /**
     * 处理刷新按钮点击
     */
    async handleRefreshClick() {
        const btn = document.getElementById('refresh-btn');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '刷新中...';
        }

        await this.refreshAll();

        if (btn) {
            btn.disabled = false;
            btn.textContent = '🔄 刷新';
        }
    }

    /**
     * 刷新所有数据
     */
    async refreshAll() {
        if (this.isRefreshing) {
            console.log('正在刷新中，跳过...');
            return;
        }

        this.isRefreshing = true;
        console.log('开始刷新数据...');

        try {
            // 并行加载所有数据
            await Promise.all([
                this.loadIndices(),
                this.loadStocks(),
                this.loadSectors(),
                this.loadNews(),
                this.loadFlash()
            ]);

            UIComponents.updateLastUpdateTime();
            console.log('数据刷新完成');
        } catch (error) {
            console.error('刷新数据失败:', error);
        } finally {
            this.isRefreshing = false;
        }
    }

    /**
     * 加载指数数据
     */
    async loadIndices() {
        try {
            const data = await StockAPI.fetchIndices();
            UIComponents.renderIndices(data);
        } catch (error) {
            UIComponents.showError('指数数据加载失败', 'index-list');
        }
    }

    /**
     * 加载个股数据
     */
    async loadStocks() {
        try {
            const data = await StockAPI.fetchStocks();
            UIComponents.renderStocks(data);
        } catch (error) {
            UIComponents.showError('个股数据加载失败', 'stock-list');
        }
    }

    /**
     * 加载板块数据
     */
    async loadSectors() {
        try {
            const data = await StockAPI.fetchSectors();
            UIComponents.renderSectors(data);
        } catch (error) {
            UIComponents.showError('板块数据加载失败', 'sector-list');
        }
    }

    /**
     * 加载新闻资讯
     */
    async loadNews() {
        try {
            const data = await StockAPI.fetchNews();
            UIComponents.renderNews(data);
        } catch (error) {
            UIComponents.showError('新闻资讯加载失败', 'news-list');
        }
    }

    /**
     * 加载财经快讯
     */
    async loadFlash() {
        try {
            const data = await StockAPI.fetchFlash();
            UIComponents.renderFlash(data);
        } catch (error) {
            UIComponents.showError('财经快讯加载失败', 'flash-list');
        }
    }

    /**
     * 启动自动刷新
     */
    startAutoRefresh() {
        // 清除可能存在的旧定时器
        this.stopAutoRefresh();

        // 设置新的定时器
        this.refreshTimer = setInterval(() => {
            this.refreshAll();
        }, AppConfig.REFRESH_INTERVAL);

        // 快讯单独刷新
        this.flashTimer = setInterval(() => {
            this.loadFlash();
        }, AppConfig.FLASH_REFRESH_INTERVAL);

        console.log(`自动刷新已启动：行情${AppConfig.REFRESH_INTERVAL/1000}秒，快讯${AppConfig.FLASH_REFRESH_INTERVAL/1000}秒`);
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
        if (this.flashTimer) {
            clearInterval(this.flashTimer);
            this.flashTimer = null;
        }
    }
}

// 创建应用实例
const app = new StockApp();

// DOM 加载完成后初始化应用
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// 页面卸载时清理定时器
window.addEventListener('beforeunload', () => {
    app.stopAutoRefresh();
});

// 导出应用实例
window.StockApp = app;
