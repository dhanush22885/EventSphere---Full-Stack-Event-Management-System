import { useEffect, useState } from "react";
import { AdminAPI } from "../services/endpoints";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

function Stat({ label, value }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);

  const load = async () => {
    const [s, u] = await Promise.all([AdminAPI.stats(), AdminAPI.users()]);
    setStats(s);
    setUsers(u);
  };
  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    if (!confirm("Delete this user?")) return;
    await AdminAPI.deleteUser(id);
    load();
  };

  if (!stats) return <Loading />;

  return (
    <div className="mx-auto max-w-7xl gap-6 px-4 py-10 md:flex">
      <Sidebar
        items={[
          { to: "/admin", label: "Overview", end: true },
          { to: "/profile", label: "Profile" },
        ]}
      />
      <div className="mt-6 flex-1 space-y-8 md:mt-0">
        <h1 className="text-2xl font-bold">Admin dashboard</h1>

        <div className="grid gap-4 md:grid-cols-4">
          <Stat label="Users" value={stats.total_users} />
          <Stat label="Organizers" value={stats.total_organizers} />
          <Stat label="Events" value={stats.total_events} />
          <Stat label="Registrations" value={stats.total_registrations} />
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">All users</h2>
          <div className="card overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 font-medium">{u.full_name}</td>
                    <td className="px-4 py-3">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">{u.role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-red-600 hover:underline" onClick={() => remove(u.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}