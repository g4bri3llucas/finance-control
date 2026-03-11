import { Suspense } from "react";

// ── PIPE personalizado: formata data ──────────────────────────────
const formatDate = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString("pt-BR");

// ── PIPE personalizado: formata texto ─────────────────────────────
const capitalize = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

// ── COMPONENTE: badge colorido de tipo ────────────────────────────
const TypeBadge = ({ type }) => (
  <span style={{
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "0.75rem",
    fontWeight: 700,
    background: type === "receita" ? "#dcfce7" : "#fee2e2",
    color:      type === "receita" ? "#15803d" : "#b91c1c",
  }}>
    {type === "receita" ? "↑ Receita" : "↓ Despesa"}
  </span>
);

// ── COMPONENTE: linha da tabela (lazy loading via Suspense) ────────
const TransactionRow = ({ tx, onDelete }) => (
  <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
    <td style={{ padding: "12px 16px", fontSize: "0.9rem" }}>
      {formatDate(tx.date)}
    </td>
    <td style={{ padding: "12px 16px" }}>
      {capitalize(tx.description)}
    </td>
    <td style={{ padding: "12px 16px" }}>
      <TypeBadge type={tx.type} />
    </td>
    <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "#6b7280" }}>
      {tx.category || "—"}
    </td>
    <td style={{ padding: "12px 16px", fontWeight: 700, color: tx.type === "receita" ? "#15803d" : "#b91c1c" }}>
      {tx.type === "receita" ? "+" : "-"}
      R$ {tx.amount.toFixed(2).replace(".", ",")}
    </td>
    <td style={{ padding: "12px 16px" }}>
      <button
        onClick={() => onDelete(tx.id)}
        style={{ background: "none", border: "1px solid #fca5a5", color: "#ef4444", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}
      >
        🗑
      </button>
    </td>
  </tr>
);

// ── COMPONENTE PRINCIPAL: tabela com Suspense ──────────────────────
export default function TransactionList({ transactions, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
        Nenhuma transação encontrada.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {["Data", "Descrição", "Tipo", "Categoria", "Valor", ""].map((h) => (
              <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "0.78rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Suspense simula lazy loading das linhas */}
          <Suspense fallback={
            <tr><td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#9ca3af" }}>Carregando...</td></tr>
          }>
            {transactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} onDelete={onDelete} />
            ))}
          </Suspense>
        </tbody>
      </table>
    </div>
  );
}