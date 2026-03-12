/**
 * Node.js 后端代理服务
 * 负责从各大财经平台获取数据，解决 CORS 跨域问题
 *
 * 启动方式：node server/server.js
 */

const http = require('http');
const url = require('url');
const https = require('https');

// 服务端口
const PORT = 3000;

/**
 * 模拟股票数据
 * 实际项目中应该替换为真实的 API 调用
 * 这里使用新浪财经等公开 API 的数据格式
 */

// 主要指数代码（新浪财经格式）
const INDICES = [
    { code: 'sh000001', name: '上证指数' },
    { code: 'sz399001', name: '深证成指' },
    { code: 'sz399006', name: '创业板指' },
    { code: 'sh000016', name: '上证 50' },
    { code: 'sh000300', name: '沪深 300' }
];

// 热门个股（示例数据）
const POPULAR_STOCKS = [
    { code: 'sh600519', name: '贵州茅台' },
    { code: 'sz000858', name: '五粮液' },
    { code: 'sz300750', name: '宁德时代' },
    { code: 'sh601318', name: '中国平安' },
    { code: 'sh600030', name: '中信证券' },
    { code: 'sz000001', name: '平安银行' },
    { code: 'sh601166', name: '兴业银行' },
    { code: 'sz000002', name: '万科 A' }
];

// 热门板块（示例数据）
const SECTORS = [
    { name: '白酒概念' },
    { name: '新能源汽车' },
    { name: '半导体' },
    { name: '人工智能' },
    { name: '医药生物' },
    { name: '金融科技' },
    { name: '消费电子' },
    { name: '光伏概念' }
];

/**
 * 从新浪财经获取实时行情
 * @param {string} code - 股票代码（格式：sh000001 或 sz399001）
 * @returns {Promise<object>} 行情数据
 */
function fetchSinaStockData(code) {
    return new Promise((resolve, reject) => {
        const market = code.substring(0, 2);
        const stockCode = code.substring(2);
        const url = `http://hq.sinajs.cn/list=${market}${stockCode}`;

        https.get(url, { timeout: 5000 }, (res) => {
            let data = '';

            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    // 解析新浪财经返回的数据格式
                    // 格式：var hq_str_sh000001="上证指数，3050.12,..."
                    const match = data.match(/="([^"]+)"/);
                    if (!match) {
                        resolve(null);
                        return;
                    }

                    const elements = match[1].split(',');
                    if (elements.length < 32) {
                        resolve(null);
                        return;
                    }

                    const name = elements[0];
                    const open = parseFloat(elements[1]);
                    const prevClose = parseFloat(elements[2]);
                    const current = parseFloat(elements[3]);

                    // 只在交易时间有实时数据
                    if (!current || current === 0) {
                        resolve(null);
                        return;
                    }

                    const change = ((current - prevClose) / prevClose * 100);

                    resolve({
                        name,
                        code,
                        price: current,
                        open,
                        prevClose,
                        change: parseFloat(change.toFixed(2)),
                        changeValue: parseFloat((current - prevClose).toFixed(2))
                    });
                } catch (error) {
                    console.error(`解析 ${code} 数据失败:`, error);
                    resolve(null);
                }
            });
        }).on('error', (error) => {
            console.error(`获取 ${code} 数据失败:`, error.message);
            resolve(null);
        });
    });
}

/**
 * 获取所有指数数据
 */
async function getIndicesData() {
    const results = [];

    for (const index of INDICES) {
        try {
            const data = await fetchSinaStockData(index.code);
            if (data) {
                results.push(data);
            } else {
                // 如果 API 失败，生成模拟数据
                results.push(generateMockData(index.name, index.code));
            }
        } catch (error) {
            console.error(`获取指数 ${index.name} 失败:`, error);
            results.push(generateMockData(index.name, index.code));
        }
    }

    return results;
}

/**
 * 获取所有个股数据
 */
async function getStocksData() {
    const results = [];

    for (const stock of POPULAR_STOCKS) {
        try {
            const data = await fetchSinaStockData(stock.code);
            if (data) {
                results.push(data);
            } else {
                results.push(generateMockData(stock.name, stock.code));
            }
        } catch (error) {
            console.error(`获取个股 ${stock.name} 失败:`, error);
            results.push(generateMockData(stock.name, stock.code));
        }
    }

    // 按涨跌幅排序
    results.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

    return results;
}

/**
 * 获取板块数据
 */
async function getSectorsData() {
    // 生成模拟板块数据（实际项目中应调用真实 API）
    return SECTORS.map(sector => {
        const basePrice = Math.random() * 2000 + 500;
        const change = (Math.random() - 0.45) * 8; // 略微偏向上涨

        return {
            name: sector.name,
            price: parseFloat(basePrice.toFixed(2)),
            change: parseFloat(change.toFixed(2))
        };
    }).sort((a, b) => b.change - a.change);
}

/**
 * 获取新闻资讯
 */
async function getNewsData() {
    // 模拟新闻数据（实际项目中应调用财联社、雪球等 API）
    const mockNews = [
        {
            title: '证监会：将持续优化资本市场基础制度，提升服务实体经济能力',
            source: '财联社',
            time: new Date().toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '新能源汽车销量持续走高，产业链相关公司业绩亮眼',
            source: '证券时报',
            time: new Date(Date.now() - 1800000).toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '央行开展逆回购操作，维护银行体系流动性合理充裕',
            source: '新华社',
            time: new Date(Date.now() - 3600000).toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '多家上市公司披露年报预告，业绩分化明显',
            source: '上海证券报',
            time: new Date(Date.now() - 7200000).toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '科技股持续活跃，半导体板块领涨两市',
            source: '财联社',
            time: new Date(Date.now() - 10800000).toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '外资持续流入 A 股，北向资金净买入超 50 亿元',
            source: ' Wind 资讯',
            time: new Date(Date.now() - 14400000).toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '医药板块异动拉升，创新药企受资金青睐',
            source: '财联社',
            time: new Date(Date.now() - 18000000).toISOString(),
            url: 'https://www.cls.cn'
        },
        {
            title: '住建部：因城施策，促进房地产市场平稳健康发展',
            source: '央视新闻',
            time: new Date(Date.now() - 21600000).toISOString(),
            url: 'https://www.cls.cn'
        }
    ];

    return mockNews;
}

/**
 * 获取财经快讯
 */
async function getFlashData() {
    // 模拟快讯数据（实际项目中应调用财联社 7x24 快讯 API）
    const now = new Date();
    const flashes = [];

    const flashContents = [
        '【央行公开市场操作】央行今日开展 1000 亿元 7 天期逆回购操作，中标利率 1.80%，今日有 800 亿元逆回购到期。',
        '【美股前瞻】隔夜美股三大指数集体收涨，纳指涨 1.2% 创历史新高，科技股全线走强。',
        '【行业动态】工信部召开新能源汽车产业发展座谈会，强调要加快充电基础设施建设。',
        '【公司公告】贵州茅台：2024 年净利润同比增长 18%，拟每 10 股派发现金红利 300 元。',
        '【经济数据】国家统计局：1-2 月份规模以上工业增加值同比增长 6.5%，超出市场预期。',
        '【资金流向】北向资金今日净买入 52.3 亿元，连续三日净流入，主要加仓白酒、新能源板块。',
        '【政策利好】发改委：将进一步扩大有效投资，加快推进"十四五"规划重大工程项目建设。',
        '【国际市场】国际油价继续上涨，布伦特原油突破 85 美元/桶，创三个月新高。',
        '【行业政策】证监会发布新规，完善上市公司股权激励制度，激发企业创新活力。',
        '【市场观察】分析师认为，当前市场情绪持续回暖，建议关注业绩确定性强的蓝筹股。'
    ];

    // 生成最近 10 条快讯，时间依次递减
    flashContents.forEach((content, index) => {
        flashes.push({
            content,
            time: new Date(now.getTime() - index * 900000).toISOString() // 每条间隔 15 分钟
        });
    });

    return flashes;
}

/**
 * 生成模拟数据（当 API 失败时使用）
 */
function generateMockData(name, code) {
    const basePrice = Math.random() * 100 + 10;
    const change = (Math.random() - 0.45) * 5; // 略微偏向上涨

    return {
        name,
        code,
        price: parseFloat(basePrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changeValue: parseFloat((basePrice * change / 100).toFixed(2))
    };
}

/**
 * 发送 JSON 响应
 */
function sendJSON(res, data, statusCode = 200) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(data));
}

/**
 * 发送错误响应
 */
function sendError(res, message, statusCode = 500) {
    sendJSON(res, { error: message }, statusCode);
}

/**
 * 创建 HTTP 服务器
 */
const server = http.createServer(async (req, res) => {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // 只处理 GET 请求
    if (req.method !== 'GET') {
        sendError(res, '不支持的请求方法', 405);
        return;
    }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    try {
        // 路由处理
        if (pathname === '/api/indices') {
            const data = await getIndicesData();
            sendJSON(res, data);
        } else if (pathname === '/api/stocks') {
            const data = await getStocksData();
            sendJSON(res, data);
        } else if (pathname === '/api/sectors') {
            const data = await getSectorsData();
            sendJSON(res, data);
        } else if (pathname === '/api/news') {
            const data = await getNewsData();
            sendJSON(res, data);
        } else if (pathname === '/api/flash') {
            const data = await getFlashData();
            sendJSON(res, data);
        } else if (pathname === '/health') {
            sendJSON(res, { status: 'ok', time: new Date().toISOString() });
        } else {
            sendError(res, '未找到资源', 404);
        }
    } catch (error) {
        console.error('服务器错误:', error);
        sendError(res, '服务器内部错误', 500);
    }
});

// 启动服务器
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║          股票热点资讯 - 后端代理服务已启动               ║
╠════════════════════════════════════════════════════════╣
║  服务地址：http://localhost:${PORT}
║  健康检查：http://localhost:${PORT}/health
║                                                          ║
║  API 端点：                                               ║
║    GET /api/indices  - 主要指数                          ║
║    GET /api/stocks   - 热门个股                          ║
║    GET /api/sectors  - 热门板块                          ║
║    GET /api/news     - 个股资讯                          ║
║    GET /api/flash    - 财经快讯                          ║
╚════════════════════════════════════════════════════════╝
    `);
});

// 优雅关闭
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('收到 SIGINT 信号，正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
