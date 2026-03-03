import { useState } from "react";

export default function LoginForm({ onLogin, onRegister }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegisterMode) {
        await onRegister(username, password);
      } else {
        await onLogin(username, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card login-card">
      <h2>{isRegisterMode ? "Inscription" : "Connexion"}</h2>
      <form onSubmit={submit}>
        <label>
          Utilisateur
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </label>
        <label>
          Mot de passe
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading
            ? isRegisterMode
              ? "Inscription..."
              : "Connexion..."
            : isRegisterMode
            ? "Creer un compte"
            : "Se connecter"}
        </button>
      </form>
      {error ? <p className="error">{error}</p> : null}
      <button
        type="button"
        className="ghost"
        onClick={() => {
          setIsRegisterMode((current) => !current);
          setError("");
        }}
      >
        {isRegisterMode ? "J ai deja un compte" : "Creer un compte"}
      </button>
    </div>
  );
}
