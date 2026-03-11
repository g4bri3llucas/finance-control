import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ── PIPE personalizado: formata "2025-03" → "Mar/25" ─────────────
const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split("-");
  const names = ["Jan","Fev","Mar","Abr","Mai","Jun",
                  "Jul","Ago","Set","Out","Nov","Dez"];
  return `${names[parseInt(month) - 1]}/${year.slice(2)}`;
};

// ── PIPE personalizado: formata valor no tooltip ──────────────────
const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export default function MonthlyChart({ transactions }) {
  // PIPE: agrupa transações por mês e soma receitas/despesas
  const data = useMemo(() => {
    const map = {};

    transactions.forEach((tx) => {
      const month = tx.date.slice(0, 7); // "2025-03"
      if (!map[month]) map[month] = { month, receita: 0, despesa: 0 };
      map[month][tx.type] += tx.amount;
    });

    return Object.values(map)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((d) => ({ ...d, month: formatMonth(d.month) }));
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#9ca3af" }}>
        Adicione transações para ver o gráfico.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} />
        <YAxis tickFormatter={(v) => `R$${v}`} tick={{ fontSize: 11, fill: "#6b7280" }} />
        <Tooltip formatter={(value) => formatCurrency(value)} />
        <Bar dataKey="receita" name="Receita" fill="#4ade80" radius={[6, 6, 0, 0]} />
        <Bar dataKey="despesa" name="Despesa" fill="#f87171" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}