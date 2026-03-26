import { useState } from 'react'
import './App.css'

const categoryIcons = {
  food: '🍔',
  housing: '🏠',
  utilities: '⚡',
  transport: '🚗',
  entertainment: '🎮',
  salary: '💼',
  other: '📦',
};

function App() {
  const [transactions, setTransactions] = useState([
    { id: 1, description: "Salary", amount: 5000, type: "income", category: "salary", date: "2025-01-01" },
    { id: 2, description: "Rent", amount: 1200, type: "expense", category: "housing", date: "2025-01-02" },
    { id: 3, description: "Groceries", amount: 150, type: "expense", category: "food", date: "2025-01-03" },
    { id: 4, description: "Freelance Work", amount: 800, type: "income", category: "salary", date: "2025-01-05" },
    { id: 5, description: "Electric Bill", amount: 95, type: "expense", category: "utilities", date: "2025-01-06" },
    { id: 6, description: "Dinner Out", amount: 65, type: "expense", category: "food", date: "2025-01-07" },
    { id: 7, description: "Gas", amount: 45, type: "expense", category: "transport", date: "2025-01-08" },
    { id: 8, description: "Netflix", amount: 15, type: "expense", category: "entertainment", date: "2025-01-10" },
  ]);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("food");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const categories = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

  const totalIncome = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  let filteredTransactions = transactions;
  if (filterType !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    filteredTransactions = filteredTransactions.filter(t => t.category === filterCategory);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: Number(amount),
      type,
      category,
      date: new Date().toISOString().split('T')[0],
    };

    setTransactions([...transactions, newTransaction]);
    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatAmount = (amt) => {
    return Number(amt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <span className="header-icon">💰</span>
        <h1>Finance Tracker</h1>
        <p className="subtitle">Track your income and expenses with ease</p>
      </div>

      {/* Summary Cards */}
      <div className="summary">
        <div className="summary-card">
          <span className="card-icon">📈</span>
          <h3>Income</h3>
          <p className="income-amount">${formatAmount(totalIncome)}</p>
        </div>
        <div className="summary-card">
          <span className="card-icon">📉</span>
          <h3>Expenses</h3>
          <p className="expense-amount">${formatAmount(totalExpenses)}</p>
        </div>
        <div className="summary-card">
          <span className="card-icon">💎</span>
          <h3>Balance</h3>
          <p className="balance-amount">${formatAmount(balance)}</p>
        </div>
      </div>

      {/* Add Transaction */}
      <div className="add-transaction">
        <div className="section-header">
          <span className="section-icon">➕</span>
          <h2>Add Transaction</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <button type="submit">Add</button>
        </form>
      </div>

      {/* Transactions List */}
      <div className="transactions">
        <div className="transactions-header">
          <div className="section-header">
            <span className="section-icon">📋</span>
            <h2>Transactions</h2>
          </div>
          <div className="filters">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {categoryIcons[cat]} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <p>No transactions found</p>
            </div>
          ) : (
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
                {filteredTransactions.map(t => (
                  <tr key={t.id}>
                    <td className="date-cell">{formatDate(t.date)}</td>
                    <td className="description-cell">{t.description}</td>
                    <td>
                      <span className={`category-badge ${t.category}`}>
                        {categoryIcons[t.category]} {t.category}
                      </span>
                    </td>
                    <td className={`amount-cell ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}${formatAmount(t.amount)}
                    </td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(t.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default App
