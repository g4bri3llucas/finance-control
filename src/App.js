import { useState, useMemo } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import SummaryCards from "./SummaryCards";
import MonthlyChart from "./MonthlyChart";

// ── PIPES personalizados centralizados ────────────────────────────
export const pipes = {
  currency: (value) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value),

  date: (dateStr) =>
    new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR"),

  monthLabel: (monthStr) => {
    const [year, month] = monthStr.split("-");
    const names = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    return `${names[parseInt(month) - 1]}/${year}`;
  },
};

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");

  const handleAdd = (tx) => setTransactions([tx, ...transactions]);
  const handleDelete = (id) => setTransactions(transactions.filter((t) => t.id !== id));

  const months = useMemo(() =>
    [...new Set(transactions.map((t) => t.date.slice(0, 7)))].sort()
  , [transactions]);

  const filtered = useMemo(() =>
    selectedMonth
      ? transactions.filter((t) => t.date.startsWith(selectedMonth))
      : transactions
  , [transactions, selectedMonth]);

  // ── PIPE: gera e baixa o arquivo CSV ─────────────────────────────
  const exportCSV = () => {
    const header = "Data,Descrição,Tipo,Categoria,Valor\n";
    const rows = filtered.map((t) =>
      `${pipes.date(t.date)},"${t.description}",${t.type},${t.category || ""},${t.amount}`
    ).join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = selectedMonth
      ? `financas-${pipes.monthLabel(selectedMonth)}.csv`
      : "financas-completo.csv";
    a.click();
    URL.revokeObjectURL(url);
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

        {/* TABS */}
        <div style={{ background: "#fff", borderRadius: "12px", padding: "6px", display: "inline-flex", gap: "4px", marginBottom: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          {[["dashboard","📊 Dashboard"],["add","➕ Adicionar"],["list","📋 Transações"]].map(([tab, label]) => (
            <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>{label}</button>
          ))}
        </div>

        {/* FILTRO + EXPORTAR */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
          <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#374151" }}>📅 Filtrar por mês:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "0.88rem", background: "#fff", cursor: "pointer" }}
          >
            <option value="">Todos os meses</option>
            {months.map((m) => (
              <option key={m} value={m}>{pipes.monthLabel(m)}</option>
            ))}
          </select>

          {/* BOTÃO EXPORTAR CSV */}
          <button
            onClick={exportCSV}
            disabled={filtered.length === 0}
            style={{
              padding: "8px 16px",
              background: filtered.length === 0 ? "#f3f4f6" : "#fff",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: filtered.length === 0 ? "not-allowed" : "pointer",
              color: filtered.length === 0 ? "#9ca3af" : "#374151",
            }}
          >
            ⬇️ Exportar CSV
          </button>
        </div>

        {/* CARDS */}
        <SummaryCards transactions={filtered} />

        {activeTab === "dashboard" && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "24px" }}>
            <h2 style={{ margin: "0 0 20px", fontSize: "1rem", fontWeight: 700 }}>📊 Gráfico Mensal</h2>
            <MonthlyChart transactions={transactions} />
          </div>
        )}

        {activeTab === "add" && <TransactionForm onAdd={handleAdd} />}

        {activeTab === "list" && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f3f4f6" }}>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>
                📋 Transações ({filtered.length})
              </h2>
            </div>
            <TransactionList transactions={filtered} onDelete={handleDelete} />
          </div>
        )}

      </div>
    </div>
  );
}