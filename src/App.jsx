import { useState, useMemo } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import './App.css'

ChartJS.register(ArcElement, Tooltip, Legend)

const categoryIcons = {
  food: '🍔',
  housing: '🏠',
  utilities: '⚡',
  transport: '🚗',
  entertainment: '🎮',
  salary: '💼',
  freelance: '💻',
  investment: '📈',
  other: '📦',
}

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function App() {
  const [transactions, setTransactions] = useState([
    // January 2025
    { id: 1, description: 'Monthly Salary', amount: 5000, type: 'income', category: 'salary', date: '2025-01-05' },
    { id: 2, description: 'Freelance Project', amount: 1200, type: 'income', category: 'freelance', date: '2025-01-12' },
    { id: 3, description: 'Rent Payment', amount: 1200, type: 'expense', category: 'housing', date: '2025-01-02' },
    { id: 4, description: 'Groceries', amount: 320, type: 'expense', category: 'food', date: '2025-01-08' },
    { id: 5, description: 'Electric Bill', amount: 95, type: 'expense', category: 'utilities', date: '2025-01-10' },
    { id: 6, description: 'Gas & Fuel', amount: 65, type: 'expense', category: 'transport', date: '2025-01-14' },
    { id: 7, description: 'Netflix & Spotify', amount: 25, type: 'expense', category: 'entertainment', date: '2025-01-15' },
    // February 2025
    { id: 8, description: 'Monthly Salary', amount: 5000, type: 'income', category: 'salary', date: '2025-02-05' },
    { id: 9, description: 'Stock Dividends', amount: 350, type: 'income', category: 'investment', date: '2025-02-18' },
    { id: 10, description: 'Rent Payment', amount: 1200, type: 'expense', category: 'housing', date: '2025-02-02' },
    { id: 11, description: 'Groceries', amount: 280, type: 'expense', category: 'food', date: '2025-02-09' },
    { id: 12, description: 'Internet Bill', amount: 60, type: 'expense', category: 'utilities', date: '2025-02-12' },
    { id: 13, description: 'Dinner Out', amount: 85, type: 'expense', category: 'food', date: '2025-02-14' },
    { id: 14, description: 'Movie Tickets', amount: 30, type: 'expense', category: 'entertainment', date: '2025-02-20' },
    // March 2025
    { id: 15, description: 'Monthly Salary', amount: 5200, type: 'income', category: 'salary', date: '2025-03-05' },
    { id: 16, description: 'Freelance Gig', amount: 800, type: 'income', category: 'freelance', date: '2025-03-15' },
    { id: 17, description: 'Investment Returns', amount: 450, type: 'income', category: 'investment', date: '2025-03-22' },
    { id: 18, description: 'Rent Payment', amount: 1200, type: 'expense', category: 'housing', date: '2025-03-02' },
    { id: 19, description: 'Groceries', amount: 340, type: 'expense', category: 'food', date: '2025-03-07' },
    { id: 20, description: 'Car Maintenance', amount: 250, type: 'expense', category: 'transport', date: '2025-03-11' },
    { id: 21, description: 'Water & Gas Bill', amount: 75, type: 'expense', category: 'utilities', date: '2025-03-13' },
    { id: 22, description: 'Gaming Subscription', amount: 15, type: 'expense', category: 'entertainment', date: '2025-03-18' },
  ])

  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('expense')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const incomeCategories = ['salary', 'freelance', 'investment', 'other']
  const expenseCategories = ['food', 'housing', 'utilities', 'transport', 'entertainment', 'other']
  const currentCategories = type === 'income' ? incomeCategories : expenseCategories

  // ─── Computed data ───
  const totalIncome = useMemo(() =>
    transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [transactions])

  const totalExpenses = useMemo(() =>
    transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [transactions])

  const totalSavings = totalIncome - totalExpenses

  // Group by month
  const monthlyData = useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      const key = t.date.slice(0, 7) // YYYY-MM
      if (!map[key]) map[key] = []
      map[key].push(t)
    })
    // Sort months descending (latest first)
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, txns]) => {
        const [year, month] = key.split('-')
        const income = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
        const expense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
        return {
          key,
          label: `${monthNames[parseInt(month) - 1]} ${year}`,
          income,
          expense,
          savings: income - expense,
          transactions: txns.sort((a, b) => a.date.localeCompare(b.date)),
        }
      })
  }, [transactions])

  // Source aggregation for charts
  const incomeSources = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'income').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return map
  }, [transactions])

  const expenseSources = useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return map
  }, [transactions])

  // Max values for progress bars
  const maxMonthlyValue = useMemo(() =>
    Math.max(...monthlyData.map(m => Math.max(m.income, m.expense, m.savings)), 1), [monthlyData])

  // ─── Chart configs ───
  const chartColors = {
    salary: '#16a34a',
    freelance: '#0891b2',
    investment: '#2563eb',
    food: '#d97706',
    housing: '#3b82f6',
    utilities: '#059669',
    transport: '#dc2626',
    entertainment: '#7c3aed',
    other: '#64748b',
  }

  const makeChartData = (sourcesMap) => {
    const labels = Object.keys(sourcesMap).map(k => (categoryIcons[k] || '') + ' ' + k.charAt(0).toUpperCase() + k.slice(1))
    const data = Object.values(sourcesMap)
    const colors = Object.keys(sourcesMap).map(k => chartColors[k] || '#94a3b8')
    return {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderColor: '#fff',
        borderWidth: 3,
        hoverOffset: 8,
      }]
    }
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { size: 12, family: 'Inter' },
          color: '#64748b',
        }
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { family: 'Inter', weight: '600' },
        bodyFont: { family: 'Inter' },
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        }
      }
    }
  }

  // ─── Handlers ───
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!description || !amount) return
    setTransactions([...transactions, {
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date,
    }])
    setDescription('')
    setAmount('')
    setType('expense')
    setCategory('food')
    setDate(new Date().toISOString().split('T')[0])
  }

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const fmt = (n) => Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="header-logo">💰</div>
          <div>
            <h1>Finance Dashboard</h1>
            <p className="subtitle">Track your income, expenses & savings</p>
          </div>
        </div>
        <div className="header-date">
          📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="summary-cards">
        <div className="summary-card income-card">
          <div className="card-header">
            <div className="card-label">
              <div className="card-icon">📈</div>
              <span>Total Income</span>
            </div>
          </div>
          <div className="card-amount">${fmt(totalIncome)}</div>
          <div className="card-sub">{Object.keys(incomeSources).length} source{Object.keys(incomeSources).length !== 1 ? 's' : ''}</div>
        </div>

        <div className="summary-card expense-card">
          <div className="card-header">
            <div className="card-label">
              <div className="card-icon">📉</div>
              <span>Total Expenses</span>
            </div>
          </div>
          <div className="card-amount">${fmt(totalExpenses)}</div>
          <div className="card-sub">{Object.keys(expenseSources).length} categor{Object.keys(expenseSources).length !== 1 ? 'ies' : 'y'}</div>
        </div>

        <div className="summary-card savings-card">
          <div className="card-header">
            <div className="card-label">
              <div className="card-icon">💎</div>
              <span>Total Savings</span>
            </div>
          </div>
          <div className="card-amount">${fmt(totalSavings)}</div>
          <div className="card-sub">{totalSavings >= 0 ? 'You\'re on track!' : 'Overspending'}</div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="charts-section">
        <div className="chart-card">
          <h3><span>💰</span> Income Sources</h3>
          {Object.keys(incomeSources).length > 0 ? (
            <div className="chart-wrapper">
              <Doughnut data={makeChartData(incomeSources)} options={chartOptions} />
            </div>
          ) : (
            <div className="chart-empty">No income data yet</div>
          )}
        </div>
        <div className="chart-card">
          <h3><span>💸</span> Expense Breakdown</h3>
          {Object.keys(expenseSources).length > 0 ? (
            <div className="chart-wrapper">
              <Doughnut data={makeChartData(expenseSources)} options={chartOptions} />
            </div>
          ) : (
            <div className="chart-empty">No expense data yet</div>
          )}
        </div>
      </div>

      {/* ── Add Transaction ── */}
      <div className="add-transaction-section">
        <h3 className="section-title"><span>➕</span> Add Transaction</h3>
        <form className="add-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="e.g. Monthly Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Type</label>
            <select value={type} onChange={(e) => { setType(e.target.value); setCategory(e.target.value === 'income' ? 'salary' : 'food') }}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {currentCategories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button type="submit" className="add-btn">Add</button>
        </form>
      </div>

      {/* ── Monthly Breakdown ── */}
      <div className="monthly-section">
        <h2><span>📊</span> Monthly Breakdown</h2>
        {monthlyData.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📭</span>
            <p>No transactions yet. Add one above to get started!</p>
          </div>
        ) : (
          monthlyData.map((month, idx) => (
            <div className="month-card" key={month.key} style={{ animationDelay: `${0.05 * idx}s` }}>
              <div className="month-card-header">
                <h3>
                  <span className="month-icon">🗓️</span>
                  {month.label}
                </h3>
                <div className="month-summary-pills">
                  <span className="pill income">📈 ${fmt(month.income)}</span>
                  <span className="pill expense">📉 ${fmt(month.expense)}</span>
                  <span className="pill savings">💎 ${fmt(month.savings)}</span>
                </div>
              </div>

              {/* Progress bars */}
              <div className="month-bars">
                <div className="bar-item">
                  <div className="bar-label">Income</div>
                  <div className="bar-track">
                    <div className="bar-fill income" style={{ width: `${(month.income / maxMonthlyValue) * 100}%` }} />
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Expenses</div>
                  <div className="bar-track">
                    <div className="bar-fill expense" style={{ width: `${(month.expense / maxMonthlyValue) * 100}%` }} />
                  </div>
                </div>
                <div className="bar-item">
                  <div className="bar-label">Savings</div>
                  <div className="bar-track">
                    <div className="bar-fill savings" style={{ width: `${(Math.max(0, month.savings) / maxMonthlyValue) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Transactions table */}
              <div className="month-transactions">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {month.transactions.map(t => (
                      <tr key={t.id}>
                        <td className="date-cell">{formatDate(t.date)}</td>
                        <td className="description-cell">{t.description}</td>
                        <td>
                          <span className={`category-badge ${t.category}`}>
                            {categoryIcons[t.category]} {t.category}
                          </span>
                        </td>
                        <td className={`amount-cell ${t.type}`}>
                          {t.type === 'income' ? '+' : '-'}${fmt(t.amount)}
                        </td>
                        <td>
                          <button className="delete-btn" onClick={() => handleDelete(t.id)}>✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default App
