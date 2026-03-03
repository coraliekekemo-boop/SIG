import { useEffect, useState } from "react";

const EMPTY = { code: "", label: "", status: "active" };

export default function VehicleForm({ selectedVehicle, onSubmit, onCancel }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (selectedVehicle) {
      setForm({
        code: selectedVehicle.code,
        label: selectedVehicle.label,
        status: selectedVehicle.status,
      });
      return;
    }
    setForm(EMPTY);
  }, [selectedVehicle]);

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
    if (!selectedVehicle) {
      setForm(EMPTY);
    }
  };

  return (
    <div className="card">
      <h3>{selectedVehicle ? "Modifier vehicule" : "Nouveau vehicule"}</h3>
      <form onSubmit={submit}>
        <label>
          Code
          <input
            value={form.code}
            onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
            required
          />
        </label>
        <label>
          Libelle
          <input
            value={form.label}
            onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
            required
          />
        </label>
        <label>
          Statut
          <select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </label>
        <div className="row">
          <button type="submit">{selectedVehicle ? "Mettre a jour" : "Ajouter"}</button>
          {selectedVehicle ? (
            <button type="button" className="ghost" onClick={onCancel}>
              Annuler
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
