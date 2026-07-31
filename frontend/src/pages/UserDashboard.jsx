import { useEffect, useState } from "react";
import { RegistrationsAPI } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import EventCard from "../components/EventCard";
import Loading, { EmptyState } from "../components/Loading";
import { Link } from "react-router-dom";

export default function UserDashboard() {
  const { user } = useAuth();
  const [regs, setRegs] = useState(null);

  useEffect(() => {
    RegistrationsAPI.mine().then(setRegs);
  }, []);

  if (!regs) return <Loading />;

  regs.forEach((r) => {
  console.log("Status:", r.status);
  console.log("Event:", r.event);
  console.log("Start Date:", r.event?.start_date);
});

  const today = new Date();
  const confirmed = regs.filter((r) => (r.status === "CONFIRMED" || r.status === "PENDING") && r.event);
const upcoming = confirmed.filter(
  (r) => new Date(r.event.start_date) >= today
);

const past = confirmed.filter(
  (r) => new Date(r.event.start_date) < today
);

  return (
    <div className="mx-auto max-w-7xl gap-6 px-4 py-10 md:flex">
      <Sidebar
        items={[
          { to: "/dashboard", label: "My events", end: true },
          { to: "/profile", label: "Profile" },
        ]}
      />
      <div className="mt-6 flex-1 space-y-8 md:mt-0">
        <div>
          <h1 className="text-2xl font-bold">Hi, {user?.full_name}</h1>
          <p className="text-sm text-slate-500">Here's what you've signed up for.</p>
        </div>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Upcoming ({upcoming.length})</h2>
          {upcoming.length === 0 ? (
            <EmptyState
              title="No upcoming events"
              description="Browse events to register."
              action={<Link to="/events" className="btn-primary">Browse events</Link>}
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((r) => <EventCard key={r.id} event={r.event} />)}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Past ({past.length})</h2>
          {past.length === 0 ? (
            <EmptyState title="No past events yet" />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((r) => <EventCard key={r.id} event={r.event} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

