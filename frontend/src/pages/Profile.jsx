import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { AuthAPI } from "../services/endpoints";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [full_name, setFullName] = useState(user?.full_name || "");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg("");
    try {
      const payload = { full_name };
      if (password) payload.password = password;
      const updated = await AuthAPI.updateMe(payload);
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setPassword("");
      setMsg("Profile updated.");
    } catch (err) {
      setMsg(err?.response?.data?.detail || "Update failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-slate-500">Manage your account details.</p>
      <form onSubmit={save} className="card mt-6 space-y-4 p-6">
        <div>
          <label className="label">Email</label>
          <input className="input bg-slate-50" value={user?.email || ""} disabled />
        </div>
        <div>
          <label className="label">Role</label>
          <input className="input bg-slate-50" value={user?.role || ""} disabled />
        </div>
        <div>
          <label className="label">Full name</label>
          <input className="input" value={full_name} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="label">New password (leave blank to keep current)</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <p className="text-sm text-slate-700">{msg}</p>}
        <button className="btn-primary" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
      </form>
    </div>
  );
}