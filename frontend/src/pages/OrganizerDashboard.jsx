import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { EventsAPI } from "../services/endpoints";
import Sidebar from "../components/Sidebar";
import Loading, { EmptyState } from "../components/Loading";
import { formatDate } from "../utils/format";

function Stat({ label, value }) {
  return (
    <div className="card p-6">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold">{value}</p>
    </div>
  );
}

export default function OrganizerDashboard() {
  const [events, setEvents] = useState(null);
  const [selected, setSelected] = useState(null);
  const [participants, setParticipants] = useState([]);

  const load = () => EventsAPI.mine().then(setEvents);
  useEffect(() => { load(); }, []);

  const openParticipants = async (id) => {
    setSelected(id);
    setParticipants(await EventsAPI.participants(id));
  };

  const remove = async (id) => {
    if (!confirm("Delete this event?")) return;
    await EventsAPI.remove(id);
    load();
  };

  if (!events) return <Loading />;

  const totalRegs = events.reduce((s, e) => s + (e.registrations_count || 0), 0);

  return (
    <div className="mx-auto max-w-7xl gap-6 px-4 py-10 md:flex">
      <Sidebar
        items={[
          { to: "/organizer", label: "Overview", end: true },
          { to: "/organizer/events/new", label: "Create event" },
          { to: "/profile", label: "Profile" },
        ]}
      />
      <div className="mt-6 flex-1 space-y-8 md:mt-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Organizer dashboard</h1>
          <Link to="/organizer/events/new" className="btn-primary">+ New event</Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Stat label="Total events" value={events.length} />
          <Stat label="Total registrations" value={totalRegs} />
          <Stat
            label="Avg. fill rate"
            value={
              events.length
                ? Math.round(
                    (events.reduce(
                      (s, e) => s + e.registrations_count / e.max_capacity, 0) /
                      events.length) * 100
                  ) + "%"
                : "0%"
            }
          />
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Your events</h2>
          {events.length === 0 ? (
            <EmptyState
              title="No events yet"
              description="Create your first event to start selling seats."
              action={<Link to="/organizer/events/new" className="btn-primary">Create event</Link>}
            />
          ) : (
            <div className="card overflow-hidden">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Location</th>
                    <th className="px-4 py-3">Registrations</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {events.map((e) => (
                    <tr key={e.id}>
                      <td className="px-4 py-3 font-medium">{e.title}</td>
                      <td className="px-4 py-3">{formatDate(e.start_date)}</td>
                      <td className="px-4 py-3">{e.location}</td>
                      <td className="px-4 py-3">{e.registrations_count} / {e.max_capacity}</td>
                      <td className="space-x-2 px-4 py-3">
                        {/* <button className="text-brand-700 hover:underline" onClick={() => openParticipants(e.id)}>
                          Participants
                        </button> */}
                        <Link className="text-slate-700 hover:underline" to={`/organizer/events/${e.id}/edit`}>
                          Edit
                        </Link>
                        <button className="text-red-600 hover:underline" onClick={() => remove(e.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setSelected(null)}>
            <div className="card w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b border-slate-200 p-4">
                <h3 className="font-semibold">Participants</h3>
                <button className="text-slate-500" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div className="max-h-[60vh] overflow-y-auto p-4">
                {participants.length === 0 ? (
                  <p className="text-sm text-slate-500">No participants yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead className="text-left text-xs uppercase text-slate-500">
                      <tr><th className="py-2">Name</th><th>Email</th><th>Status</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {participants.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2">{p.full_name}</td>
                          <td>{p.email}</td>
                          <td>{p.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}