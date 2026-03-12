/**
 * UI 组件模块 - 负责渲染各种 UI 组件
 * 提供统一的渲染接口，保持代码整洁
 */

/**
 * 渲染指数列表
 * @param {Array} data - 指数数据数组
 * @param {string} containerId - 容器 ID
 */
function renderIndices(data, containerId = 'index-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">暂无数据</div>';
        return;
    }

    container.innerHTML = data.map(item => {
        const isUp = item.change >= 0;
        const changeClass = isUp ? 'up up-bg' : 'down down-bg';

        return `
            <div class="data-item">
                <div>
                    <span class="name">${item.name}</span>
                    <span class="code">${item.code}</span>
                </div>
                <div class="price-row">
                    <span class="price">${StockAPI.formatNumber(item.price)}</span>
                    <span class="change ${changeClass}">${StockAPI.formatPercent(item.change)}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染个股列表
 * @param {Array} data - 个股数据数组
 * @param {string} containerId - 容器 ID
 */
function renderStocks(data, containerId = 'stock-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">暂无数据</div>';
        return;
    }

    container.innerHTML = data.map(item => {
        const isUp = item.change >= 0;
        const changeClass = isUp ? 'up up-bg' : 'down down-bg';

        return `
            <div class="data-item">
                <div>
                    <span class="name">${item.name}</span>
                    <span class="code">${item.code}</span>
                </div>
                <div class="price-row">
                    <span class="price">${StockAPI.formatNumber(item.price)}</span>
                    <span class="change ${changeClass}">${StockAPI.formatPercent(item.change)}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染板块列表
 * @param {Array} data - 板块数据数组
 * @param {string} containerId - 容器 ID
 */
function renderSectors(data, containerId = 'sector-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">暂无数据</div>';
        return;
    }

    container.innerHTML = data.map(item => {
        const isUp = item.change >= 0;
        const changeClass = isUp ? 'up up-bg' : 'down down-bg';

        return `
            <div class="data-item">
                <div>
                    <span class="name">${item.name}</span>
                </div>
                <div class="price-row">
                    <span class="price">${StockAPI.formatNumber(item.price)}</span>
                    <span class="change ${changeClass}">${StockAPI.formatPercent(item.change)}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染新闻资讯列表
 * @param {Array} data - 新闻数据数组
 * @param {string} containerId - 容器 ID
 */
function renderNews(data, containerId = 'news-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">暂无数据</div>';
        return;
    }

    container.innerHTML = data.map(item => {
        return `
            <div class="news-item" onclick="window.open('${item.url}', '_blank')">
                <div class="news-title">${item.title}</div>
                <div class="news-meta">
                    <span class="news-source">${item.source || '未知来源'}</span>
                    <span class="news-time">${StockAPI.formatTime(item.time)}</span>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染财经快讯列表
 * @param {Array} data - 快讯数据数组
 * @param {string} containerId - 容器 ID
 */
function renderFlash(data, containerId = 'flash-list') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!data || data.length === 0) {
        container.innerHTML = '<div class="error">暂无数据</div>';
        return;
    }

    container.innerHTML = data.map(item => {
        return `
            <div class="flash-item">
                <div class="flash-time">${StockAPI.formatTime(item.time)}</div>
                <div class="flash-content">${item.content}</div>
            </div>
        `;
    }).join('');
}

/**
 * 显示加载状态
 * @param {string} containerId - 容器 ID
 */
function showLoading(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '<div class="loading">加载中...</div>';
    }
}

/**
 * 显示错误信息
 * @param {string} message - 错误信息
 * @param {string} containerId - 容器 ID
 */
function showError(message, containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="error">${message}</div>`;
    }
}

/**
 * 更新最后更新时间
 * @param {Date} date - 更新时间
 */
function updateLastUpdateTime(date = new Date()) {
    const element = document.getElementById('last-update');
    if (element) {
        const timeStr = date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        element.textContent = `最后更新：${timeStr}`;
    }
}

// 导出所有渲染函数
window.UIComponents = {
    renderIndices,
    renderStocks,
    renderSectors,
    renderNews,
    renderFlash,
    showLoading,
    showError,
    updateLastUpdateTime
};
