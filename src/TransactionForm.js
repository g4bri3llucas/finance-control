import { useState } from "react";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    type: "receita",
    date: "",
    category: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = () => {
    // Validações
    if (!form.description || !form.amount || !form.date) {
      setError("Preencha descrição, valor e data.");
      return;
    }
    if (isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      setError("Digite um valor válido.");
      return;
    }

    // Chama a função do App.js passando a transação nova
    onAdd({ ...form, amount: parseFloat(form.amount), id: Date.now() });

    // Limpa o formulário
    setForm({ description: "", amount: "", type: "receita", date: "", category: "" });
    setError("");
  };

  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "0.9rem",
    background: "#f9fafb",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: "14px", padding: "24px" }}>
      <h2 style={{ margin: "0 0 18px", fontSize: "1rem", fontWeight: 700 }}>
        ➕ Nova Transação
      </h2>

      {/* MENSAGEM DE ERRO */}
      {error && (
        <div style={{ background: "#fee2e2", color: "#b91c1c", padding: "8px 12px", borderRadius: "8px", marginBottom: "12px", fontSize: "0.85rem" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

        {/* DESCRIÇÃO — ocupa as 2 colunas */}
        <div style={{ gridColumn: "1 / -1" }}>
          <input
            style={inputStyle}
            placeholder="Descrição (ex: salário, aluguel...)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <input
          style={inputStyle}
          placeholder="Valor (R$)"
          type="number"
          min="0"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          style={inputStyle}
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          style={{ ...inputStyle, cursor: "pointer" }}
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="receita">Receita</option>
          <option value="despesa">Despesa</option>
        </select>

        <input
          style={inputStyle}
          placeholder="Categoria (ex: alimentação)"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: "16px",
          width: "100%",
          padding: "12px",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "0.95rem",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Adicionar Transação
      </button>
    </div>
  );
}