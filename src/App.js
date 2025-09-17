// src/App.js
import React, { useState, useEffect } from "react";
import {
  addExpense,
  getExpenses,
  deleteExpense,
} from "./api/expenses";
import Chatbot from "./Chatbot";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function App() {
  const [expenses, setExpenses] = useState([]);
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getExpenses();
      setExpenses(data);
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!item || !amount || !category || !date) {
      alert("Please fill all fields!");
      return;
    }
    const newExpense = {
      id: Date.now(),
      item,
      amount: parseFloat(amount),
      category,
      note,
      date,
    };
    await addExpense(newExpense);
    setExpenses([...expenses, newExpense]);
    setItem("");
    setAmount("");
    setCategory("");
    setNote("");
    setDate("");
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  // Pie chart data
  const pieData = Object.values(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = acc[exp.category] || {
        name: exp.category,
        value: 0,
      };
      acc[exp.category].value += exp.amount;
      return acc;
    }, {})
  );

  const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className={darkMode ? "text-white" : "text-gray-900"}>
      <div className="min-h-screen flex">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-20" : "w-64"
          } bg-blue-700 text-white p-6 space-y-6 transition-all duration-300`}
        >
          {/* Sidebar Header */}
          <div className="flex justify-between items-center">
            {!collapsed && <h2 className="text-2xl font-bold">💰 DigiFinance</h2>}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600"
            >
              {collapsed ? "☰" : "✖️"}
            </button>
          </div>

          {/* Sidebar Links */}
          <nav className="space-y-3 mt-6">
            <a href="#" className="block hover:text-yellow-300">
              📋 {!collapsed && "Dashboard"}
            </a>
            <a href="#" className="block hover:text-yellow-300">
              ➕ {!collapsed && "Add Expense"}
            </a>
            <a href="#" className="block hover:text-yellow-300">
              📊 {!collapsed && "Reports"}
            </a>
            <a href="#" className="block hover:text-yellow-300">
              🤖 {!collapsed && "Chatbot"}
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="bg-white/80 backdrop-blur-md dark:bg-gray-800 shadow p-4 flex justify-between items-center rounded-lg">
            <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
            <div className="flex items-center gap-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
              </button>
              {/* Profile */}
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                U
              </div>
            </div>
          </header>

          {/* Main Dashboard Area */}
          <main className="flex-1 p-8 max-w-7xl mx-auto space-y-6">
            {/* Input Form */}
            <section className="bg-white/90 dark:bg-gray-800 p-6 shadow rounded-lg">
              <h2 className="text-xl font-semibold mb-4">➕ Add Expense</h2>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Item"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-700"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="Category (e.g. Food, Travel)"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-700"
                />
                <input
                  type="text"
                  placeholder="Note (optional)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="border rounded p-2 dark:bg-gray-700"
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border rounded p-2 col-span-2 dark:bg-gray-700"
                />
              </div>
              <button
                onClick={handleAdd}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Add Expense
              </button>
            </section>

            {/* Dashboard Widgets */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Expenses</h3>
                <p className="text-2xl font-bold">₹{expenses.reduce((s, e) => s + e.amount, 0)}</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Categories</h3>
                <p className="text-2xl font-bold">{pieData.length}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Entries</h3>
                <p className="text-2xl font-bold">{expenses.length}</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/90 dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">📊 Spending by Category</h2>
                <PieChart width={300} height={250}>
                  <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={90} label>
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
              <div className="bg-white/90 dark:bg-gray-800 shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">📈 Spending Over Time</h2>
                <LineChart width={350} height={250} data={expenses}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#2563eb" />
                </LineChart>
              </div>
            </div>

            {/* Expense List */}
            <section className="bg-white/90 dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">📋 Expense List</h2>
              {expenses.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-300">No expenses yet.</p>
              ) : (
                <ul>
                  {expenses.map((exp, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b py-2">
                      <div>
                        <strong>{exp.item}</strong> — ₹{exp.amount} <br />
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          {exp.category} | {exp.date} | {exp.note}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Chatbot */}
            <section className="bg-white/90 dark:bg-gray-800 shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">🤖 AI Chatbot</h2>
              <Chatbot expenses={expenses} />
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
