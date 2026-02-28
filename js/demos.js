// ===== Financial KPI Dashboard Demo =====
function loadFinancialDashboard(container) {
    container.innerHTML = `
        <div class="demo-header">
            <h2>Financial KPI Dashboard</h2>
            <p class="demo-description">
                Interactive Power BI-style dashboard demonstrating credit risk metrics, spending trends, 
                and compliance indicators with real-time data visualization.
            </p>
        </div>
        
        <div class="dashboard-grid">
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-line"></i> Credit Risk Metrics</h3>
                <canvas id="creditRiskChart"></canvas>
            </div>
            
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-bar"></i> Monthly Spending Trends</h3>
                <canvas id="spendingTrendsChart"></canvas>
            </div>
            
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-pie"></i> Transaction Categories</h3>
                <canvas id="categoriesChart"></canvas>
            </div>
            
            <div class="dashboard-card">
                <h3><i class="fas fa-chart-area"></i> Compliance Score Over Time</h3>
                <canvas id="complianceChart"></canvas>
            </div>
        </div>
        
        <div class="dashboard-stats">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-content">
                    <span class="stat-value">45,823</span>
                    <span class="stat-label">Active Accounts</span>
                    <span class="stat-change positive">+12.5%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
                <div class="stat-content">
                    <span class="stat-value">$2.4M</span>
                    <span class="stat-label">Total Transactions</span>
                    <span class="stat-change positive">+8.3%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="stat-content">
                    <span class="stat-value">98.5%</span>
                    <span class="stat-label">Compliance Rate</span>
                    <span class="stat-change positive">+2.1%</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-exclamation-triangle"></i></div>
                <div class="stat-content">
                    <span class="stat-value">127</span>
                    <span class="stat-label">Risk Alerts</span>
                    <span class="stat-change negative">-15.2%</span>
                </div>
            </div>
        </div>
        
        <div class="code-preview">
            <div class="code-preview-header">
                <span><i class="fas fa-code"></i> DAX Measures Used</span>
                <button onclick="copyToClipboard(document.getElementById('daxCode').textContent)" class="copy-btn">
                    <i class="fas fa-copy"></i> Copy
                </button>
            </div>
            <pre><code id="daxCode">-- Total Transaction Amount
Total_Transactions = 
SUM(Transactions[Amount])

-- Credit Risk Score
Credit_Risk_Score = 
CALCULATE(
    AVERAGE(Customers[RiskScore]),
    FILTER(
        Customers,
        Customers[Status] = "Active"
    )
)

-- Compliance Rate
Compliance_Rate = 
DIVIDE(
    CALCULATE(COUNT(Transactions[ID]), Transactions[Compliant] = TRUE),
    COUNT(Transactions[ID]),
    0
) * 100

-- Month Over Month Growth
MoM_Growth = 
VAR CurrentMonth = [Total_Transactions]
VAR PreviousMonth = CALCULATE([Total_Transactions], DATEADD('Date'[Date], -1, MONTH))
RETURN DIVIDE(CurrentMonth - PreviousMonth, PreviousMonth, 0) * 100</code></pre>
        </div>
    `;
    
    addDashboardStyles();
    initializeCharts();
}

function addDashboardStyles() {
    if (document.getElementById('dashboardStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'dashboardStyles';
    style.textContent = `
        .demo-header {
            text-align: center;
            margin-bottom: 2rem;
        }
        
        .demo-header h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
        }
        
        .demo-description {
            color: var(--text-secondary);
            max-width: 800px;
            margin: 0 auto;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .dashboard-card {
            background: var(--bg-card);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            border: 1px solid var(--border-color);
        }
        
        .dashboard-card h3 {
            font-size: 1.125rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .dashboard-card canvas {
            width: 100% !important;
            height: 250px !important;
        }
        
        .dashboard-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            display: flex;
            gap: 1rem;
            align-items: center;
            color: white;
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
        }
        
        .stat-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .stat-value {
            font-size: 1.75rem;
            font-weight: 800;
        }
        
        .stat-label {
            font-size: 0.875rem;
            opacity: 0.9;
        }
        
        .stat-change {
            font-size: 0.875rem;
            font-weight: 600;
            margin-top: 0.25rem;
        }
        
        .stat-change.positive {
            color: #10b981;
        }
        
        .stat-change.negative {
            color: #ef4444;
        }
        
        .code-preview {
            background: var(--bg-tertiary);
            border-radius: var(--border-radius);
            overflow: hidden;
            margin-top: 2rem;
        }
        
        .code-preview-header {
            background: var(--bg-card);
            padding: 1rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--border-color);
        }
        
        .copy-btn {
            padding: 0.5rem 1rem;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: var(--border-radius);
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
        }
        
        .copy-btn:hover {
            background: var(--secondary-color);
            transform: scale(1.05);
        }
        
        .code-preview pre {
            margin: 0;
            padding: 1.5rem;
            overflow-x: auto;
        }
        
        .code-preview code {
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .dashboard-stats {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

function initializeCharts() {
    // Credit Risk Chart
    const creditRiskCtx = document.getElementById('creditRiskChart');
    if (creditRiskCtx) {
        new Chart(creditRiskCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Low Risk',
                    data: [65, 68, 70, 72, 75, 77, 80, 82, 85, 87, 89, 91],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Medium Risk',
                    data: [25, 24, 23, 22, 20, 19, 17, 15, 13, 11, 9, 7],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'High Risk',
                    data: [10, 8, 7, 6, 5, 4, 3, 3, 2, 2, 2, 2],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
    
    // Spending Trends Chart
    const spendingTrendsCtx = document.getElementById('spendingTrendsChart');
    if (spendingTrendsCtx) {
        new Chart(spendingTrendsCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Transaction Volume ($M)',
                    data: [1.8, 2.1, 2.3, 2.0, 2.5, 2.7, 2.9, 3.1, 2.8, 3.2, 3.4, 3.6],
                    backgroundColor: 'rgba(37, 99, 235, 0.8)',
                    borderColor: '#2563eb',
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Categories Chart
    const categoriesCtx = document.getElementById('categoriesChart');
    if (categoriesCtx) {
        new Chart(categoriesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Retail', 'Dining', 'Travel', 'Entertainment', 'Utilities', 'Healthcare', 'Other'],
                datasets: [{
                    data: [28, 18, 15, 12, 10, 8, 9],
                    backgroundColor: [
                        '#2563eb',
                        '#7c3aed',
                        '#06b6d4',
                        '#10b981',
                        '#f59e0b',
                        '#ef4444',
                        '#64748b'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    }
    
    // Compliance Chart
    const complianceCtx = document.getElementById('complianceChart');
    if (complianceCtx) {
        new Chart(complianceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Compliance Score (%)',
                    data: [95.2, 96.1, 96.8, 97.2, 97.5, 97.8, 98.0, 98.2, 98.3, 98.4, 98.5, 98.6],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        min: 94,
                        max: 100
                    }
                }
            }
        });
    }
}

// ===== SQL Query Optimizer Demo =====
function loadSQLOptimizer(container) {
    container.innerHTML = `
        <div class="demo-header">
            <h2>SQL Query Optimizer</h2>
            <p class="demo-description">
                Advanced SQL techniques including CTEs, window functions, and performance optimization 
                for large-scale financial datasets.
            </p>
        </div>
        
        <div class="sql-demo-container">
            <div class="query-tabs">
                <button class="tab-btn active" onclick="showQuery('basic')">Basic Query</button>
                <button class="tab-btn" onclick="showQuery('cte')">Using CTEs</button>
                <button class="tab-btn" onclick="showQuery('window')">Window Functions</button>
                <button class="tab-btn" onclick="showQuery('optimized')">Optimized Query</button>
            </div>
            
            <div class="query-content">
                <div class="query-panel active" id="query-basic">
                    <div class="query-header">
                        <h3>Basic Query - Non-Optimized</h3>
                        <button onclick="copyToClipboard(document.getElementById('basicQuery').textContent)" class="copy-btn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre><code id="basicQuery">-- Non-optimized query with subqueries
SELECT 
    c.customer_id,
    c.customer_name,
    (SELECT SUM(amount) 
     FROM transactions t 
     WHERE t.customer_id = c.customer_id) as total_spent,
    (SELECT COUNT(*) 
     FROM transactions t 
     WHERE t.customer_id = c.customer_id) as transaction_count,
    (SELECT AVG(amount) 
     FROM transactions t 
     WHERE t.customer_id = c.customer_id) as avg_transaction
FROM customers c
WHERE c.status = 'Active';

-- Execution Time: ~2.3 seconds
-- Rows Scanned: 10,000,000+</code></pre>
                    <div class="performance-metric">
                        <span class="metric-label">Performance:</span>
                        <span class="metric-value slow">Slow - 2.3s</span>
                    </div>
                </div>
                
                <div class="query-panel" id="query-cte">
                    <div class="query-header">
                        <h3>Using Common Table Expressions (CTEs)</h3>
                        <button onclick="copyToClipboard(document.getElementById('cteQuery').textContent)" class="copy-btn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre><code id="cteQuery">-- Optimized with CTEs for better readability and performance
WITH customer_transactions AS (
    SELECT 
        customer_id,
        SUM(amount) as total_spent,
        COUNT(*) as transaction_count,
        AVG(amount) as avg_transaction
    FROM transactions
    WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
    GROUP BY customer_id
),
risk_scores AS (
    SELECT 
        customer_id,
        CASE 
            WHEN total_spent > 100000 THEN 'Low'
            WHEN total_spent > 50000 THEN 'Medium'
            ELSE 'High'
        END as risk_category
    FROM customer_transactions
)
SELECT 
    c.customer_id,
    c.customer_name,
    ct.total_spent,
    ct.transaction_count,
    ct.avg_transaction,
    rs.risk_category
FROM customers c
INNER JOIN customer_transactions ct ON c.customer_id = ct.customer_id
INNER JOIN risk_scores rs ON c.customer_id = rs.customer_id
WHERE c.status = 'Active'
ORDER BY ct.total_spent DESC;

-- Execution Time: ~0.8 seconds
-- Improvement: 65% faster</code></pre>
                    <div class="performance-metric">
                        <span class="metric-label">Performance:</span>
                        <span class="metric-value medium">Better - 0.8s</span>
                    </div>
                </div>
                
                <div class="query-panel" id="query-window">
                    <div class="query-header">
                        <h3>Advanced Window Functions</h3>
                        <button onclick="copyToClipboard(document.getElementById('windowQuery').textContent)" class="copy-btn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre><code id="windowQuery">-- Advanced analytics with window functions
SELECT 
    customer_id,
    customer_name,
    transaction_date,
    amount,
    -- Running total
    SUM(amount) OVER (
        PARTITION BY customer_id 
        ORDER BY transaction_date
    ) as running_total,
    -- Moving average (3-month)
    AVG(amount) OVER (
        PARTITION BY customer_id 
        ORDER BY transaction_date 
        ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
    ) as moving_avg_3month,
    -- Rank by spending within category
    RANK() OVER (
        PARTITION BY category 
        ORDER BY amount DESC
    ) as category_rank,
    -- Lag comparison (previous transaction)
    LAG(amount, 1) OVER (
        PARTITION BY customer_id 
        ORDER BY transaction_date
    ) as previous_amount,
    -- Growth rate
    ROUND(
        (amount - LAG(amount, 1) OVER (
            PARTITION BY customer_id 
            ORDER BY transaction_date
        )) / LAG(amount, 1) OVER (
            PARTITION BY customer_id 
            ORDER BY transaction_date
        ) * 100, 
        2
    ) as growth_rate_pct
FROM transactions t
JOIN customers c ON t.customer_id = c.customer_id
WHERE t.transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
ORDER BY customer_id, transaction_date;

-- Execution Time: ~0.5 seconds
-- Enables complex analytics without subqueries</code></pre>
                    <div class="performance-metric">
                        <span class="metric-label">Performance:</span>
                        <span class="metric-value fast">Fast - 0.5s</span>
                    </div>
                </div>
                
                <div class="query-panel" id="query-optimized">
                    <div class="query-header">
                        <h3>Fully Optimized Query</h3>
                        <button onclick="copyToClipboard(document.getElementById('optimizedQuery').textContent)" class="copy-btn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <pre><code id="optimizedQuery">-- Production-ready optimized query with all best practices
WITH RECURSIVE date_spine AS (
    -- Generate date range for complete time series
    SELECT DATE_SUB(CURRENT_DATE, INTERVAL 365 DAY) as date_value
    UNION ALL
    SELECT DATE_ADD(date_value, INTERVAL 1 DAY)
    FROM date_spine
    WHERE date_value < CURRENT_DATE
),
indexed_transactions AS (
    -- Use indexed columns and filter early
    SELECT /*+ INDEX(t idx_customer_date) */
        customer_id,
        transaction_date,
        amount,
        category
    FROM transactions t
    WHERE transaction_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 YEAR)
        AND status = 'Completed'
        AND amount > 0
),
aggregated_metrics AS (
    SELECT 
        customer_id,
        COUNT(*) as total_transactions,
        SUM(amount) as total_spent,
        AVG(amount) as avg_transaction,
        MAX(amount) as max_transaction,
        MIN(amount) as min_transaction,
        STDDEV(amount) as spend_volatility,
        COUNT(DISTINCT DATE_FORMAT(transaction_date, '%Y-%m')) as active_months
    FROM indexed_transactions
    GROUP BY customer_id
    HAVING total_spent > 1000  -- Filter early
)
SELECT 
    c.customer_id,
    c.customer_name,
    c.account_type,
    am.total_transactions,
    am.total_spent,
    am.avg_transaction,
    am.spend_volatility,
    am.active_months,
    -- Risk scoring
    CASE 
        WHEN am.spend_volatility > 5000 THEN 'High Volatility'
        WHEN am.avg_transaction > 10000 THEN 'High Value'
        WHEN am.total_transactions > 100 THEN 'High Frequency'
        ELSE 'Standard'
    END as customer_segment,
    -- Percentile ranking
    PERCENT_RANK() OVER (ORDER BY am.total_spent) as spend_percentile
FROM customers c
INNER JOIN aggregated_metrics am ON c.customer_id = am.customer_id
WHERE c.status = 'Active'
    AND c.kyc_verified = TRUE
ORDER BY am.total_spent DESC
LIMIT 1000;

-- Execution Time: ~0.3 seconds
-- Improvement: 87% faster than original
-- Uses: Indexes, Early Filtering, CTEs, Window Functions</code></pre>
                    <div class="performance-metric">
                        <span class="metric-label">Performance:</span>
                        <span class="metric-value best">Best - 0.3s</span>
                    </div>
                </div>
            </div>
            
            <div class="optimization-tips">
                <h3><i class="fas fa-lightbulb"></i> Optimization Techniques Applied</h3>
                <ul>
                    <li><strong>Index Hints:</strong> Force use of optimal indexes for faster data retrieval</li>
                    <li><strong>Early Filtering:</strong> Apply WHERE conditions before joins and aggregations</li>
                    <li><strong>CTEs:</strong> Break complex queries into readable, maintainable parts</li>
                    <li><strong>Window Functions:</strong> Avoid correlated subqueries for analytics</li>
                    <li><strong>Aggregation Optimization:</strong> Group and filter before joining large tables</li>
                    <li><strong>HAVING Clause:</strong> Filter aggregated results efficiently</li>
                    <li><strong>LIMIT:</strong> Restrict result set size when full data isn't needed</li>
                </ul>
            </div>
        </div>
    `;
    
    addSQLDemoStyles();
}

function addSQLDemoStyles() {
    if (document.getElementById('sqlDemoStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'sqlDemoStyles';
    style.textContent = `
        .sql-demo-container {
            margin-top: 2rem;
        }
        
        .query-tabs {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
        }
        
        .tab-btn {
            padding: 0.75rem 1.5rem;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            font-weight: 600;
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }
        
        .tab-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .tab-btn:hover:not(.active) {
            background: var(--bg-card);
            border-color: var(--primary-color);
        }
        
        .query-content {
            position: relative;
        }
        
        .query-panel {
            display: none;
            background: var(--bg-card);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            box-shadow: var(--shadow-md);
        }
        
        .query-panel.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .query-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .query-header h3 {
            font-size: 1.25rem;
            color: var(--text-primary);
        }
        
        .query-panel pre {
            background: var(--bg-tertiary);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            overflow-x: auto;
            margin: 1rem 0;
        }
        
        .query-panel code {
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }
        
        .performance-metric {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-tertiary);
            border-radius: var(--border-radius);
            margin-top: 1rem;
        }
        
        .metric-label {
            font-weight: 600;
            color: var(--text-secondary);
        }
        
        .metric-value {
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
        }
        
        .metric-value.slow {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
        }
        
        .metric-value.medium {
            background: rgba(245, 158, 11, 0.2);
            color: #f59e0b;
        }
        
        .metric-value.fast {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
        }
        
        .metric-value.best {
            background: rgba(37, 99, 235, 0.2);
            color: #2563eb;
        }
        
        .optimization-tips {
            background: var(--bg-card);
            border-radius: var(--border-radius);
            padding: 2rem;
            margin-top: 2rem;
            box-shadow: var(--shadow-md);
        }
        
        .optimization-tips h3 {
            font-size: 1.25rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .optimization-tips h3 i {
            color: #f59e0b;
        }
        
        .optimization-tips ul {
            list-style: none;
            display: grid;
            gap: 0.75rem;
        }
        
        .optimization-tips li {
            padding: 0.75rem;
            background: var(--bg-tertiary);
            border-radius: var(--border-radius);
            color: var(--text-secondary);
            border-left: 3px solid var(--primary-color);
        }
        
        .optimization-tips strong {
            color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .query-tabs {
                flex-direction: column;
            }
            
            .tab-btn {
                width: 100%;
            }
        }
    `;
    document.head.appendChild(style);
}

function showQuery(queryType) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.query-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    event.target.classList.add('active');
    document.getElementById(`query-${queryType}`).classList.add('active');
}

// ===== Python ETL Automation Demo =====
function loadPythonETL(container) {
    container.innerHTML = `
        <div class="demo-header">
            <h2>Python ETL Automation</h2>
            <p class="demo-description">
                Automated data pipeline extracting from multiple sources, transforming with Python, 
                and loading into data warehouse - reducing manual effort by 40%.
            </p>
        </div>
        
        <div class="etl-pipeline">
            <div class="pipeline-step">
                <div class="step-icon extract"><i class="fas fa-database"></i></div>
                <h3>Extract</h3>
                <p>SAP S/4HANA, Snowflake, SQL Server, CSV Files, APIs</p>
            </div>
            <div class="pipeline-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="pipeline-step">
                <div class="step-icon transform"><i class="fab fa-python"></i></div>
                <h3>Transform</h3>
                <p>Clean, Validate, Enrich, Aggregate, Calculate</p>
            </div>
            <div class="pipeline-arrow"><i class="fas fa-arrow-right"></i></div>
            <div class="pipeline-step">
                <div class="step-icon load"><i class="fas fa-server"></i></div>
                <h3>Load</h3>
                <p>Data Warehouse, Power BI, SAP Analytics Cloud</p>
            </div>
        </div>
        
        <div class="etl-metrics">
            <div class="etl-metric-card">
                <div class="metric-icon"><i class="fas fa-clock"></i></div>
                <div class="metric-data">
                    <span class="metric-before">Before: 4.5 hours</span>
                    <span class="metric-after">After: 2.7 hours</span>
                    <span class="metric-improvement">40% Time Saved</span>
                </div>
            </div>
            <div class="etl-metric-card">
                <div class="metric-icon"><i class="fas fa-check-circle"></i></div>
                <div class="metric-data">
                    <span class="metric-before">Manual Errors: 12%</span>
                    <span class="metric-after">Automated Accuracy: 99.8%</span>
                    <span class="metric-improvement">87% Error Reduction</span>
                </div>
            </div>
            <div class="etl-metric-card">
                <div class="metric-icon"><i class="fas fa-sync"></i></div>
                <div class="metric-data">
                    <span class="metric-before">Daily Manual Run</span>
                    <span class="metric-after">Hourly Auto-Sync</span>
                    <span class="metric-improvement">24/7 Automation</span>
                </div>
            </div>
        </div>
        
        <div class="code-tabs">
            <button class="etl-tab-btn active" onclick="showETLCode('extract')">Extract</button>
            <button class="etl-tab-btn" onclick="showETLCode('transform')">Transform</button>
            <button class="etl-tab-btn" onclick="showETLCode('load')">Load</button>
            <button class="etl-tab-btn" onclick="showETLCode('orchestrate')">Orchestrate</button>
        </div>
        
        <div class="etl-code-panels">
            <div class="etl-code-panel active" id="etl-extract">
                <div class="code-preview-header">
                    <span><i class="fab fa-python"></i> extract_data.py</span>
                    <button onclick="copyToClipboard(document.getElementById('extractCode').textContent)" class="copy-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <pre><code id="extractCode">import pandas as pd
import pyodbc
import snowflake.connector
from datetime import datetime, timedelta
import logging

class DataExtractor:
    """Extract data from multiple sources"""
    
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
    def extract_from_sap(self, query, date_range):
        """Extract data from SAP S/4HANA"""
        try:
            conn = pyodbc.connect(
                f'DRIVER={{SAP HANA}};'
                f'SERVERNODE={self.config["sap_host"]};'
                f'DATABASE={self.config["sap_db"]};'
                f'UID={self.config["sap_user"]};'
                f'PWD={self.config["sap_pwd"]}'
            )
            
            # Execute query with date parameters
            query_params = {
                'start_date': date_range['start'],
                'end_date': date_range['end']
            }
            
            df = pd.read_sql_query(query, conn, params=query_params)
            self.logger.info(f"Extracted {len(df)} rows from SAP")
            
            conn.close()
            return df
            
        except Exception as e:
            self.logger.error(f"SAP extraction failed: {str(e)}")
            raise
    
    def extract_from_snowflake(self, query):
        """Extract data from Snowflake data warehouse"""
        try:
            conn = snowflake.connector.connect(
                user=self.config['sf_user'],
                password=self.config['sf_pwd'],
                account=self.config['sf_account'],
                warehouse=self.config['sf_warehouse'],
                database=self.config['sf_database'],
                schema=self.config['sf_schema']
            )
            
            df = pd.read_sql_query(query, conn)
            self.logger.info(f"Extracted {len(df)} rows from Snowflake")
            
            conn.close()
            return df
            
        except Exception as e:
            self.logger.error(f"Snowflake extraction failed: {str(e)}")
            raise
    
    def extract_from_sql_server(self, query):
        """Extract data from SQL Server"""
        try:
            conn_string = (
                f'DRIVER={{ODBC Driver 17 for SQL Server}};'
                f'SERVER={self.config["sql_server"]};'
                f'DATABASE={self.config["sql_db"]};'
                f'UID={self.config["sql_user"]};'
                f'PWD={self.config["sql_pwd"]}'
            )
            
            conn = pyodbc.connect(conn_string)
            df = pd.read_sql_query(query, conn)
            self.logger.info(f"Extracted {len(df)} rows from SQL Server")
            
            conn.close()
            return df
            
        except Exception as e:
            self.logger.error(f"SQL Server extraction failed: {str(e)}")
            raise</code></pre>
            </div>
            
            <div class="etl-code-panel" id="etl-transform">
                <div class="code-preview-header">
                    <span><i class="fab fa-python"></i> transform_data.py</span>
                    <button onclick="copyToClipboard(document.getElementById('transformCode').textContent)" class="copy-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <pre><code id="transformCode">import pandas as pd
import numpy as np
from datetime import datetime
import logging

class DataTransformer:
    """Transform and clean extracted data"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    def clean_data(self, df):
        """Remove duplicates, handle nulls, fix data types"""
        initial_rows = len(df)
        
        # Remove exact duplicates
        df = df.drop_duplicates()
        
        # Handle missing values
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        df[numeric_cols] = df[numeric_cols].fillna(0)
        
        string_cols = df.select_dtypes(include=['object']).columns
        df[string_cols] = df[string_cols].fillna('UNKNOWN')
        
        # Fix data types
        if 'transaction_date' in df.columns:
            df['transaction_date'] = pd.to_datetime(df['transaction_date'])
        
        # Remove outliers using IQR method
        for col in numeric_cols:
            Q1 = df[col].quantile(0.25)
            Q3 = df[col].quantile(0.75)
            IQR = Q3 - Q1
            df = df[~((df[col] < (Q1 - 1.5 * IQR)) | 
                      (df[col] > (Q3 + 1.5 * IQR)))]
        
        rows_removed = initial_rows - len(df)
        self.logger.info(f"Cleaned data: removed {rows_removed} rows")
        
        return df
    
    def validate_data(self, df, rules):
        """Validate data against business rules"""
        validation_results = []
        
        for rule in rules:
            field = rule['field']
            condition = rule['condition']
            
            if condition == 'not_null':
                invalid_count = df[field].isnull().sum()
                validation_results.append({
                    'rule': f'{field} not null',
                    'passed': invalid_count == 0,
                    'failures': invalid_count
                })
            
            elif condition == 'range':
                min_val, max_val = rule['range']
                invalid = df[(df[field] < min_val) | (df[field] > max_val)]
                validation_results.append({
                    'rule': f'{field} in range [{min_val}, {max_val}]',
                    'passed': len(invalid) == 0,
                    'failures': len(invalid)
                })
        
        return validation_results
    
    def enrich_data(self, df, reference_data):
        """Add calculated fields and reference data"""
        # Add time-based features
        if 'transaction_date' in df.columns:
            df['year'] = df['transaction_date'].dt.year
            df['month'] = df['transaction_date'].dt.month
            df['quarter'] = df['transaction_date'].dt.quarter
            df['day_of_week'] = df['transaction_date'].dt.dayofweek
            df['is_weekend'] = df['day_of_week'].isin([5, 6])
        
        # Calculate risk scores
        if 'amount' in df.columns:
            df['risk_score'] = self.calculate_risk_score(df['amount'])
            df['amount_category'] = pd.cut(
                df['amount'],
                bins=[0, 100, 1000, 10000, np.inf],
                labels=['Small', 'Medium', 'Large', 'Very Large']
            )
        
        # Merge with reference data
        if reference_data is not None:
            df = df.merge(reference_data, how='left', 
                         on='customer_id', suffixes=('', '_ref'))
        
        return df
    
    def calculate_risk_score(self, amounts):
        """Calculate transaction risk score"""
        scores = []
        for amount in amounts:
            if amount > 50000:
                scores.append('High')
            elif amount > 10000:
                scores.append('Medium')
            else:
                scores.append('Low')
        return scores
    
    def aggregate_data(self, df, group_by, aggregations):
        """Aggregate data for reporting"""
        return df.groupby(group_by).agg(aggregations).reset_index()</code></pre>
            </div>
            
            <div class="etl-code-panel" id="etl-load">
                <div class="code-preview-header">
                    <span><i class="fab fa-python"></i> load_data.py</span>
                    <button onclick="copyToClipboard(document.getElementById('loadCode').textContent)" class="copy-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <pre><code id="loadCode">import pandas as pd
import sqlalchemy
from sqlalchemy import create_engine
import logging

class DataLoader:
    """Load transformed data to target systems"""
    
    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
    def load_to_warehouse(self, df, table_name, mode='append'):
        """Load data to SQL Server data warehouse"""
        try:
            # Create SQLAlchemy engine
            engine = create_engine(
                f'mssql+pyodbc://{self.config["dw_user"]}:'
                f'{self.config["dw_pwd"]}@{self.config["dw_server"]}/'
                f'{self.config["dw_db"]}?driver=ODBC+Driver+17+for+SQL+Server'
            )
            
            # Load data
            df.to_sql(
                name=table_name,
                con=engine,
                if_exists=mode,  # 'append', 'replace', or 'fail'
                index=False,
                chunksize=10000,
                method='multi'
            )
            
            self.logger.info(
                f"Loaded {len(df)} rows to {table_name} "
                f"(mode: {mode})"
            )
            
            # Update metadata table
            self.update_load_metadata(engine, table_name, len(df))
            
            return True
            
        except Exception as e:
            self.logger.error(f"Data warehouse load failed: {str(e)}")
            raise
    
    def load_to_snowflake(self, df, table_name):
        """Load data to Snowflake"""
        try:
            from snowflake.connector.pandas_tools import write_pandas
            import snowflake.connector
            
            conn = snowflake.connector.connect(
                user=self.config['sf_user'],
                password=self.config['sf_pwd'],
                account=self.config['sf_account'],
                warehouse=self.config['sf_warehouse'],
                database=self.config['sf_database'],
                schema=self.config['sf_schema']
            )
            
            # Write DataFrame to Snowflake
            success, nchunks, nrows, _ = write_pandas(
                conn, df, table_name, auto_create_table=True
            )
            
            self.logger.info(
                f"Loaded {nrows} rows to Snowflake table {table_name}"
            )
            
            conn.close()
            return success
            
        except Exception as e:
            self.logger.error(f"Snowflake load failed: {str(e)}")
            raise
    
    def update_load_metadata(self, engine, table_name, row_count):
        """Track ETL run metadata"""
        metadata = pd.DataFrame([{
            'table_name': table_name,
            'load_timestamp': pd.Timestamp.now(),
            'rows_loaded': row_count,
            'status': 'SUCCESS'
        }])
        
        metadata.to_sql(
            name='etl_load_log',
            con=engine,
            if_exists='append',
            index=False
        )
    
    def refresh_power_bi(self, dataset_id):
        """Trigger Power BI dataset refresh"""
        try:
            import requests
            
            # Get access token
            token_url = f"https://login.microsoftonline.com/{self.config['tenant_id']}/oauth2/v2.0/token"
            token_data = {
                'grant_type': 'client_credentials',
                'client_id': self.config['client_id'],
                'client_secret': self.config['client_secret'],
                'scope': 'https://analysis.windows.net/powerbi/api/.default'
            }
            
            token_response = requests.post(token_url, data=token_data)
            access_token = token_response.json()['access_token']
            
            # Trigger refresh
            refresh_url = (
                f"https://api.powerbi.com/v1.0/myorg/datasets/"
                f"{dataset_id}/refreshes"
            )
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(refresh_url, headers=headers)
            
            if response.status_code == 202:
                self.logger.info(f"Power BI refresh triggered for dataset {dataset_id}")
                return True
            else:
                self.logger.error(f"Power BI refresh failed: {response.text}")
                return False
                
        except Exception as e:
            self.logger.error(f"Power BI refresh error: {str(e)}")
            raise</code></pre>
            </div>
            
            <div class="etl-code-panel" id="etl-orchestrate">
                <div class="code-preview-header">
                    <span><i class="fab fa-python"></i> orchestrate_pipeline.py</span>
                    <button onclick="copyToClipboard(document.getElementById('orchestrateCode').textContent)" class="copy-btn">
                        <i class="fas fa-copy"></i> Copy
                    </button>
                </div>
                <pre><code id="orchestrateCode">import logging
from datetime import datetime, timedelta
from extract_data import DataExtractor
from transform_data import DataTransformer
from load_data import DataLoader
import yaml

class ETLOrchestrator:
    """Orchestrate the complete ETL pipeline"""
    
    def __init__(self, config_file='config.yaml'):
        # Load configuration
        with open(config_file, 'r') as f:
            self.config = yaml.safe_load(f)
        
        # Initialize components
        self.extractor = DataExtractor(self.config)
        self.transformer = DataTransformer()
        self.loader = DataLoader(self.config)
        
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(f'etl_run_{datetime.now():%Y%m%d_%H%M%S}.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
    
    def run_pipeline(self, pipeline_name):
        """Execute complete ETL pipeline"""
        start_time = datetime.now()
        self.logger.info(f"Starting ETL pipeline: {pipeline_name}")
        
        try:
            # Stage 1: Extract
            self.logger.info("Stage 1: Extracting data...")
            raw_data = self.extract_stage(pipeline_name)
            
            # Stage 2: Transform
            self.logger.info("Stage 2: Transforming data...")
            transformed_data = self.transform_stage(raw_data, pipeline_name)
            
            # Stage 3: Load
            self.logger.info("Stage 3: Loading data...")
            self.load_stage(transformed_data, pipeline_name)
            
            # Stage 4: Post-processing
            self.logger.info("Stage 4: Post-processing...")
            self.post_process_stage(pipeline_name)
            
            # Calculate execution time
            execution_time = datetime.now() - start_time
            self.logger.info(
                f"Pipeline {pipeline_name} completed successfully "
                f"in {execution_time.total_seconds():.2f} seconds"
            )
            
            # Send success notification
            self.send_notification(
                status='SUCCESS',
                pipeline=pipeline_name,
                duration=execution_time
            )
            
            return True
            
        except Exception as e:
            self.logger.error(f"Pipeline {pipeline_name} failed: {str(e)}")
            
            # Send failure notification
            self.send_notification(
                status='FAILED',
                pipeline=pipeline_name,
                error=str(e)
            )
            
            raise
    
    def extract_stage(self, pipeline_name):
        """Extract data from configured sources"""
        pipeline_config = self.config['pipelines'][pipeline_name]
        date_range = {
            'start': datetime.now() - timedelta(days=30),
            'end': datetime.now()
        }
        
        extracted_data = {}
        
        # Extract from SAP
        if 'sap_query' in pipeline_config:
            extracted_data['sap'] = self.extractor.extract_from_sap(
                pipeline_config['sap_query'],
                date_range
            )
        
        # Extract from Snowflake
        if 'snowflake_query' in pipeline_config:
            extracted_data['snowflake'] = self.extractor.extract_from_snowflake(
                pipeline_config['snowflake_query']
            )
        
        # Extract from SQL Server
        if 'sqlserver_query' in pipeline_config:
            extracted_data['sqlserver'] = self.extractor.extract_from_sql_server(
                pipeline_config['sqlserver_query']
            )
        
        return extracted_data
    
    def transform_stage(self, raw_data, pipeline_name):
        """Transform and clean data"""
        pipeline_config = self.config['pipelines'][pipeline_name]
        
        # Combine data from all sources
        combined_df = None
        for source, df in raw_data.items():
            if combined_df is None:
                combined_df = df
            else:
                combined_df = combined_df.merge(df, how='outer', 
                                                on=pipeline_config.get('join_keys', ['id']))
        
        # Clean data
        cleaned_df = self.transformer.clean_data(combined_df)
        
        # Validate data
        validation_results = self.transformer.validate_data(
            cleaned_df,
            pipeline_config.get('validation_rules', [])
        )
        
        for result in validation_results:
            if not result['passed']:
                self.logger.warning(
                    f"Validation failed: {result['rule']} - "
                    f"{result['failures']} failures"
                )
        
        # Enrich data
        enriched_df = self.transformer.enrich_data(
            cleaned_df,
            pipeline_config.get('reference_data')
        )
        
        # Aggregate if needed
        if 'aggregations' in pipeline_config:
            enriched_df = self.transformer.aggregate_data(
                enriched_df,
                pipeline_config['aggregations']['group_by'],
                pipeline_config['aggregations']['functions']
            )
        
        return enriched_df
    
    def load_stage(self, data, pipeline_name):
        """Load transformed data to targets"""
        pipeline_config = self.config['pipelines'][pipeline_name]
        
        # Load to data warehouse
        self.loader.load_to_warehouse(
            data,
            pipeline_config['target_table'],
            mode=pipeline_config.get('load_mode', 'append')
        )
        
        # Load to Snowflake if configured
        if pipeline_config.get('load_to_snowflake', False):
            self.loader.load_to_snowflake(
                data,
                pipeline_config['target_table']
            )
    
    def post_process_stage(self, pipeline_name):
        """Execute post-processing tasks"""
        pipeline_config = self.config['pipelines'][pipeline_name]
        
        # Refresh Power BI datasets
        if 'powerbi_datasets' in pipeline_config:
            for dataset_id in pipeline_config['powerbi_datasets']:
                self.loader.refresh_power_bi(dataset_id)
    
    def send_notification(self, status, pipeline, **kwargs):
        """Send email/Teams notification"""
        # Implementation for sending notifications
        pass

if __name__ == "__main__":
    # Run the pipeline
    orchestrator = ETLOrchestrator()
    orchestrator.run_pipeline('financial_transactions')</code></pre>
            </div>
        </div>
    `;
    
    addETLDemoStyles();
}

function addETLDemoStyles() {
    if (document.getElementById('etlDemoStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'etlDemoStyles';
    style.textContent = `
        .etl-pipeline {
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 3rem 0;
            padding: 2rem;
            background: var(--bg-card);
            border-radius: var(--border-radius-lg);
            box-shadow: var(--shadow-md);
        }
        
        .pipeline-step {
            text-align: center;
            flex: 1;
        }
        
        .step-icon {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
            margin: 0 auto 1rem;
            animation: pulse 2s infinite;
        }
        
        .step-icon.extract {
            background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        }
        
        .step-icon.transform {
            background: linear-gradient(135deg, #06b6d4 0%, #10b981 100%);
        }
        
        .step-icon.load {
            background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%);
        }
        
        .pipeline-step h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
        }
        
        .pipeline-step p {
            color: var(--text-secondary);
            font-size: 0.875rem;
        }
        
        .pipeline-arrow {
            font-size: 2rem;
            color: var(--primary-color);
            animation: slideRight 2s infinite;
        }
        
        @keyframes slideRight {
            0%, 100% { transform: translateX(0); opacity: 0.5; }
            50% { transform: translateX(10px); opacity: 1; }
        }
        
        .etl-metrics {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
        }
        
        .etl-metric-card {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            display: flex;
            gap: 1.5rem;
            align-items: center;
        }
        
        .etl-metric-card .metric-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: var(--gradient-primary);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 1.5rem;
            flex-shrink: 0;
        }
        
        .metric-data {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .metric-before {
            color: var(--text-tertiary);
            font-size: 0.875rem;
            text-decoration: line-through;
        }
        
        .metric-after {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 1rem;
        }
        
        .metric-improvement {
            color: var(--success-color);
            font-weight: 700;
            font-size: 1.125rem;
        }
        
        .code-tabs {
            display: flex;
            gap: 0.5rem;
            margin: 2rem 0 1rem;
            flex-wrap: wrap;
        }
        
        .etl-tab-btn {
            padding: 0.75rem 1.5rem;
            background: var(--bg-tertiary);
            border: 2px solid var(--border-color);
            border-radius: var(--border-radius);
            cursor: pointer;
            font-weight: 600;
            color: var(--text-secondary);
            transition: all 0.3s ease;
        }
        
        .etl-tab-btn.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .etl-code-panels {
            position: relative;
        }
        
        .etl-code-panel {
            display: none;
            background: var(--bg-card);
            border-radius: var(--border-radius);
            padding: 1.5rem;
            box-shadow: var(--shadow-md);
        }
        
        .etl-code-panel.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        .etl-code-panel pre {
            background: var(--bg-tertiary);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            overflow-x: auto;
            margin-top: 1rem;
        }
        
        .etl-code-panel code {
            font-family: 'Fira Code', monospace;
            font-size: 0.875rem;
            line-height: 1.8;
            color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
            .etl-pipeline {
                flex-direction: column;
                gap: 1rem;
            }
            
            .pipeline-arrow {
                transform: rotate(90deg);
            }
        }
    `;
    document.head.appendChild(style);
}

function showETLCode(codeType) {
    // Remove active class from all tabs and panels
    document.querySelectorAll('.etl-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.etl-code-panel').forEach(panel => panel.classList.remove('active'));
    
    // Add active class to selected tab and panel
    event.target.classList.add('active');
    document.getElementById(`etl-${codeType}`).classList.add('active');
}

// ===== SAP Data Integration Demo =====
function loadSAPIntegration(container) {
    container.innerHTML = `
        <div class="demo-header">
            <h2>SAP Data Integration</h2>
            <p class="demo-description">
                Multi-source data integration connecting SAP S/4HANA, Snowflake, and SQL Server, 
                ensuring 99.5% data accuracy and consistency across enterprise reporting.
            </p>
        </div>
        
        <div class="integration-architecture">
            <div class="source-systems">
                <h3>Source Systems</h3>
                <div class="system-card sap">
                    <i class="fas fa-cube"></i>
                    <h4>SAP S/4HANA</h4>
                    <p>Financial Transactions</p>
                    <span class="status connected">Connected</span>
                </div>
                <div class="system-card sap">
                    <i class="fas fa-cubes"></i>
                    <h4>SAP BW/4HANA</h4>
                    <p>Historical Data</p>
                    <span class="status connected">Connected</span>
                </div>
                <div class="system-card">
                    <i class="fas fa-boxes"></i>
                    <h4>SAP ECC</h4>
                    <p>Legacy Systems</p>
                    <span class="status connected">Connected</span>
                </div>
            </div>
            
            <div class="integration-layer">
                <h3>Integration Layer</h3>
                <div class="integration-process">
                    <div class="process-step">
                        <i class="fas fa-download"></i>
                        <span>Extract</span>
                    </div>
                    <div class="process-step">
                        <i class="fas fa-cog"></i>
                        <span>Transform</span>
                    </div>
                    <div class="process-step">
                        <i class="fas fa-check-circle"></i>
                        <span>Validate</span>
                    </div>
                    <div class="process-step">
                        <i class="fas fa-upload"></i>
                        <span>Load</span>
                    </div>
                </div>
                <div class="sync-status">
                    <i class="fas fa-sync fa-spin"></i>
                    <span>Real-time Synchronization Active</span>
                </div>
            </div>
            
            <div class="target-systems">
                <h3>Target Systems</h3>
                <div class="system-card target">
                    <i class="fas fa-snowflake"></i>
                    <h4>Snowflake</h4>
                    <p>Data Warehouse</p>
                    <span class="status synced">Synced</span>
                </div>
                <div class="system-card target">
                    <i class="fas fa-server"></i>
                    <h4>SQL Server</h4>
                    <p>Operational DB</p>
                    <span class="status synced">Synced</span>
                </div>
                <div class="system-card target">
                    <i class="fas fa-chart-bar"></i>
                    <h4>Power BI</h4>
                    <p>Analytics</p>
                    <span class="status synced">Synced</span>
                </div>
            </div>
        </div>
        
        <div class="integration-metrics-grid">
            <div class="int-metric">
                <h4>Data Accuracy</h4>
                <div class="metric-value-large">99.5%</div>
                <div class="metric-chart">
                    <canvas id="accuracyChart"></canvas>
                </div>
            </div>
            <div class="int-metric">
                <h4>Sync Frequency</h4>
                <div class="metric-value-large">Real-time</div>
                <p>Average latency: <strong>2.3 seconds</strong></p>
            </div>
            <div class="int-metric">
                <h4>Systems Integrated</h4>
                <div class="metric-value-large">6</div>
                <p>SAP S/4HANA, BW, ECC, Snowflake, SQL Server, Power BI</p>
            </div>
            <div class="int-metric">
                <h4>Daily Records</h4>
                <div class="metric-value-large">1.2M</div>
                <div class="metric-chart">
                    <canvas id="volumeChart"></canvas>
                </div>
            </div>
        </div>
        
        <div class="data-flow">
            <h3><i class="fas fa-stream"></i> Data Flow Visualization</h3>
            <canvas id="dataFlowChart" style="height: 400px;"></canvas>
        </div>
        
        <div class="integration-benefits">
            <h3><i class="fas fa-trophy"></i> Integration Benefits</h3>
            <div class="benefits-grid">
                <div class="benefit-card">
                    <i class="fas fa-clock"></i>
                    <h4>Real-time Data</h4>
                    <p>Eliminated 4-hour delay in financial reporting</p>
                </div>
                <div class="benefit-card">
                    <i class="fas fa-chart-line"></i>
                    <h4>Single Source of Truth</h4>
                    <p>Unified view across all systems with 99.5% accuracy</p>
                </div>
                <div class="benefit-card">
                    <i class="fas fa-sync-alt"></i>
                    <h4>Automated Sync</h4>
                    <p>Zero manual intervention, 24/7 automated synchronization</p>
                </div>
                <div class="benefit-card">
                    <i class="fas fa-shield-alt"></i>
                    <h4>Data Governance</h4>
                    <p>Enhanced audit trail and compliance tracking</p>
                </div>
            </div>
        </div>
    `;
    
    addSAPIntegrationStyles();
    initializeSAPCharts();
}

function addSAPIntegrationStyles() {
    if (document.getElementById('sapIntegrationStyles')) return;
    
    const style = document.createElement('style');
    style.id = 'sapIntegrationStyles';
    style.textContent = `
        .integration-architecture {
            display: grid;
            grid-template-columns: 1fr 1.5fr 1fr;
            gap: 2rem;
            margin: 3rem 0;
        }
        
        .source-systems, .target-systems, .integration-layer {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .source-systems h3, .target-systems h3, .integration-layer h3 {
            text-align: center;
            color: var(--text-primary);
            margin-bottom: 1rem;
        }
        
        .system-card {
            background: var(--bg-card);
            padding: 1.5rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            text-align: center;
            border: 2px solid var(--border-color);
            transition: all 0.3s ease;
        }
        
        .system-card:hover {
            transform: translateY(-5px);
            box-shadow: var(--shadow-lg);
        }
        
        .system-card.sap {
            border-color: #0070d2;
        }
        
        .system-card.target {
            border-color: #10b981;
        }
        
        .system-card i {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            color: var(--primary-color);
        }
        
        .system-card h4 {
            font-size: 1.125rem;
            margin-bottom: 0.25rem;
        }
        
        .system-card p {
            font-size: 0.875rem;
            color: var(--text-tertiary);
            margin-bottom: 0.75rem;
        }
        
        .status {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 600;
        }
        
        .status.connected {
            background: rgba(37, 99, 235, 0.2);
            color: #2563eb;
        }
        
        .status.synced {
            background: rgba(16, 185, 129, 0.2);
            color: #10b981;
        }
        
        .integration-layer {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
        }
        
        .integration-process {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .process-step {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: var(--bg-tertiary);
            border-radius: var(--border-radius);
        }
        
        .process-step i {
            font-size: 1.5rem;
            color: var(--primary-color);
        }
        
        .sync-status {
            text-align: center;
            padding: 1rem;
            background: rgba(16, 185, 129, 0.1);
            border-radius: var(--border-radius);
            color: var(--success-color);
            font-weight: 600;
        }
        
        .sync-status i {
            margin-right: 0.5rem;
        }
        
        .integration-metrics-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin: 3rem 0;
        }
        
        .int-metric {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            text-align: center;
        }
        
        .int-metric h4 {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-bottom: 1rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .metric-value-large {
            font-size: 3rem;
            font-weight: 800;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
        }
        
        .metric-chart canvas {
            max-height: 100px;
        }
        
        .data-flow {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
            margin: 3rem 0;
        }
        
        .data-flow h3 {
            margin-bottom: 2rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .integration-benefits {
            background: var(--bg-card);
            padding: 2rem;
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-md);
        }
        
        .integration-benefits h3 {
            margin-bottom: 2rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .benefits-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
        }
        
        .benefit-card {
            padding: 1.5rem;
            background: var(--bg-tertiary);
            border-radius: var(--border-radius);
            text-align: center;
        }
        
        .benefit-card i {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }
        
        .benefit-card h4 {
            margin-bottom: 0.5rem;
        }
        
        .benefit-card p {
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        
        @media (max-width: 768px) {
            .integration-architecture {
                grid-template-columns: 1fr;
            }
        }
    `;
    document.head.appendChild(style);
}

function initializeSAPCharts() {
    // Accuracy Chart
    const accuracyCtx = document.getElementById('accuracyChart');
    if (accuracyCtx) {
        new Chart(accuracyCtx, {
            type: 'doughnut',
            data: {
                labels: ['Accurate', 'Errors'],
                datasets: [{
                    data: [99.5, 0.5],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Volume Chart
    const volumeCtx = document.getElementById('volumeChart');
    if (volumeCtx) {
        new Chart(volumeCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Records (K)',
                    data: [1050, 1180, 1220, 1190, 1240, 980, 850],
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    }
    
    // Data Flow Chart
    const dataFlowCtx = document.getElementById('dataFlowChart');
    if (dataFlowCtx) {
        new Chart(dataFlowCtx, {
            type: 'bar',
            data: {
                labels: ['SAP S/4HANA', 'SAP BW/4HANA', 'SAP ECC', 'Snowflake', 'SQL Server', 'Power BI'],
                datasets: [{
                    label: 'Records Processed (K)',
                    data: [450, 280, 190, 520, 480, 520],
                    backgroundColor: [
                        'rgba(37, 99, 235, 0.8)',
                        'rgba(124, 58, 237, 0.8)',
                        'rgba(6, 182, 212, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

console.log('Project demos loaded successfully! 🚀');