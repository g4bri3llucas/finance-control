import { useState } from "react";
import TransactionForm from "./TransactionForm";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);

  const handleAdd = (tx) => {
    setTransactions([tx, ...transactions]);
  };

  const tabStyle = (tab) => ({
    padding: "8px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.88rem",
    background: activeTab === tab
      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
      : "transparent",
    color: activeTab === tab ? "#fff" : "#6b7280",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", padding: "24px 32px", color: "#fff" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>💰 FinanceControl</h1>
          <p style={{ margin: "4px 0 0", opacity: 0.85, fontSize: "0.9rem" }}>
            Controle suas receitas e despesas com facilidade
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ background: "#fff", borderRadius: "12px", padding: "6px", display: "inline-flex", gap: "4px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          {[
            ["dashboard", "📊 Dashboard"],
            ["add",       "➕ Adicionar"],
            ["list",      "📋 Transações"],
          ].map(([tab, label]) => (
            <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && <p>Gráfico vai aparecer aqui...</p>}
        {activeTab === "add"       && <TransactionForm onAdd={handleAdd} />}
        {activeTab === "list"      && <p>Lista vai aparecer aqui... ({transactions.length} transações)</p>}
      </div>
    </div>
  );
}