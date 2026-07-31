import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { EventsAPI } from "../services/endpoints";
import EventCard from "../components/EventCard";

export default function Landing() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    EventsAPI.list({ page: 1, page_size: 3 })
      .then((d) => setFeatured(d.items))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              Event Management Platform
            </span>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
              Discover, create & manage events — all in one place.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">
              EventSphere brings organizers and attendees together. Publish events in minutes,
              track registrations, and grow your community.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/events" className="btn bg-white text-brand-700 hover:bg-slate-100">
                Browse events
              </Link>
              <Link
                to="/signup"
                className="btn border border-white/40 bg-transparent text-white hover:bg-white/10"
              >
                Become an organizer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { t: "For attendees", d: "Discover events near you and register in seconds." },
            { t: "For organizers", d: "Powerful dashboard, participant lists, capacity control." },
            { t: "Secure & fast", d: "JWT auth, role-based access, PostgreSQL-backed." },
          ].map((f) => (
            <div key={f.t} className="card p-6">
              <h3 className="text-lg font-semibold">{f.t}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured events */}
      <section className="mx-auto max-w-7xl px-4 pb-24">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured events</h2>
            <p className="text-sm text-slate-500">A taste of what's happening on EventSphere.</p>
          </div>
          <Link to="/events" className="text-sm font-semibold text-brand-700 hover:underline">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <div className="card p-10 text-center text-slate-500">
            No events yet. Sign in as an organizer to create the first one.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
