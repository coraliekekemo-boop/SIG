export default function VehicleList({ vehicles, onEdit, onDelete, onShowHistory, selectedId }) {
  return (
    <div className="card">
      <h3>Vehicules</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Libelle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className={selectedId === v.id ? "selected" : ""}>
              <td>{v.id}</td>
              <td>{v.code}</td>
              <td>{v.label}</td>
              <td>{v.status}</td>
              <td className="actions">
                <button onClick={() => onShowHistory(v.id)}>Trajet</button>
                <button onClick={() => onEdit(v)} className="ghost">
                  Editer
                </button>
                <button onClick={() => onDelete(v.id)} className="danger">
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {!vehicles.length ? (
            <tr>
              <td colSpan="5">Aucun vehicule</td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}
