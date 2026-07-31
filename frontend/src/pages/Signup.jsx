import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { register, loading } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const u = await register(form);
      nav(u.role === "ORGANIZER" ? "/organizer" : "/dashboard");
    } catch (err) {
      setError(err?.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-slate-500">Free forever. No credit card required.</p>
      <form onSubmit={onSubmit} className="card mt-6 space-y-4 p-6">
        {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div>
          <label className="label">Full name</label>
          <input className="input" required value={form.full_name} onChange={set("full_name")} />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required minLength={6} value={form.password} onChange={set("password")} />
        </div>
        <div>
          <label className="label">Account type</label>
          <select className="input" value={form.role} onChange={set("role")}>
            <option value="USER">Attendee</option>
            <option value="ORGANIZER">Organizer</option>
          </select>
        </div>
        <button className="btn-primary w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </button>
        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-brand-700">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
