// ── PIPE personalizado: formata valor em R$ ───────────────────────
const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

// ── COMPONENTE: card individual ───────────────────────────────────
const Card = ({ label, value, color, icon }) => (
  <div style={{
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "20px 24px",
    flex: 1,
    minWidth: "160px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  }}>
    <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{icon}</div>
    <div style={{ fontSize: "0.8rem", color: "#6b7280", fontWeight: 600, marginBottom: "4px" }}>
      {label}
    </div>
    <div style={{ fontSize: "1.4rem", fontWeight: 800, color }}>
      {formatCurrency(value)}
    </div>
  </div>
);

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────
export default function SummaryCards({ transactions }) {
  // PIPE: calcula os totais a partir das transações
  const receita  = transactions
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + t.amount, 0);

  const despesa  = transactions
    .filter((t) => t.type === "despesa")
    .reduce((sum, t) => sum + t.amount, 0);

  const saldo = receita - despesa;

  return (
    <div style={{ display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" }}>
      <Card label="Total Receitas" value={receita} color="#15803d" icon="📈" />
      <Card label="Total Despesas" value={despesa} color="#b91c1c" icon="📉" />
      <Card
        label="Saldo"
        value={saldo}
        color={saldo >= 0 ? "#1d4ed8" : "#b91c1c"}
        icon="🏦"
      />
    </div>
  );
}