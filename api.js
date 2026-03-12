/**
 * API 模块 - 负责与后端服务通信
 * 所有数据请求都通过此模块统一管理
 */

// 后端服务地址（开发环境使用 localhost）
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * API 请求通用函数
 * @param {string} endpoint - API 端点路径
 * @param {object} options - fetch 选项
 * @returns {Promise<any>} 返回解析后的数据
 */
async function request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP 错误：${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API 请求失败 [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * 获取主要指数数据
 * 包括上证指数、深证成指、创业板指等
 * @returns {Promise<Array>} 指数数据数组
 */
async function fetchIndices() {
    return request('/indices');
}

/**
 * 获取热门个股数据
 * @returns {Promise<Array>} 个股数据数组
 */
async function fetchStocks() {
    return request('/stocks');
}

/**
 * 获取热门板块数据
 * @returns {Promise<Array>} 板块数据数组
 */
async function fetchSectors() {
    return request('/sectors');
}

/**
 * 获取个股资讯
 * @returns {Promise<Array>} 新闻资讯数组
 */
async function fetchNews() {
    return request('/news');
}

/**
 * 获取财经快讯
 * @returns {Promise<Array>} 快讯数据数组
 */
async function fetchFlash() {
    return request('/flash');
}

/**
 * 格式化数字为货币格式
 * @param {number} num - 需要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
    if (num === null || num === undefined) return '--';
    return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * 格式化百分比
 * @param {number} num - 百分比数值
 * @returns {string} 格式化后的百分比字符串
 */
function formatPercent(num) {
    if (num === null || num === undefined) return '--';
    const sign = num > 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
}

/**
 * 格式化时间为友好显示
 * @param {string|Date} time - 时间字符串或 Date 对象
 * @returns {string} 格式化后的时间字符串
 */
function formatTime(time) {
    if (!time) return '--';
    const date = new Date(time);
    const now = new Date();
    const diff = now - date;

    // 今天内的时间显示时分
    if (diff < 24 * 60 * 60 * 1000 && date.getDate() === now.getDate()) {
        return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    }

    // 显示月 - 日 时：分
    return date.toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 导出所有 API 函数和工具函数
window.StockAPI = {
    request,
    fetchIndices,
    fetchStocks,
    fetchSectors,
    fetchNews,
    fetchFlash,
    formatNumber,
    formatPercent,
    formatTime
};
