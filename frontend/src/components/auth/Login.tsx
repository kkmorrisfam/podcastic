import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/useAuthStore";
import { API_BASE } from "../../utils/config";



export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }

    // Store user (now includes name)
    login(
      {
        id: data.user.id,
        email: data.user.email,
        firstName: data.user.firstName,
        lastName: data.user.lastName
      },
      data.token
    );

    navigate("/");
  } catch {
    setError("Network error");
  }
};


  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-surface rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />

        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />

        <button
          className="w-full py-2 bg-highlight text-bg rounded hover:opacity-90"
        >
          Login
        </button>
      </form>

      <p className="mt-4 text-sm text-text-secondary">
        No account?{" "}
        <button
          onClick={() => navigate("/register")}
          className="text-highlight underline"
        >
          Register
        </button>
      </p>
    </div>
  );
}
