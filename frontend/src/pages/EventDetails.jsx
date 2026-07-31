import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventsAPI, RegistrationsAPI } from "../services/endpoints";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTime } from "../utils/format";
import Loading from "../components/Loading";

export default function EventDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [event, setEvent] = useState(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = () => EventsAPI.get(id).then(setEvent);
  useEffect(() => {
    load();
  }, [id]);

  if (!event) return <Loading />;

  const register = async () => {
    if (!user) return nav("/login");
    setBusy(true);
    setMsg("");
    try {
      await RegistrationsAPI.register(event.id);
      setMsg("You're registered! 🎉");
      load();
    } catch (e) {
      setMsg(e?.response?.data?.detail || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="card overflow-hidden">
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="h-72 w-full object-cover" />
        )}
        <div className="p-6 md:p-8">
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
            {event.category}
          </span>
          <h1 className="mt-3 text-3xl font-bold">{event.title}</h1>
          <p className="mt-1 text-sm text-slate-500">Organized by {event.organizer_name}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">When</p>
              <p className="font-medium">{formatDate(event.start_date)} — {formatDate(event.end_date)}</p>
              <p className="text-sm text-slate-600">{formatTime(event.start_time)} – {formatTime(event.end_time)}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Where</p>
              <p className="font-medium">{event.venue}</p>
              <p className="text-sm text-slate-600">{event.location}</p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">About</h2>
            <p className="mt-2 whitespace-pre-line text-slate-700">{event.description}</p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4">
            <div>
              <p className="text-sm text-slate-500">Available seats</p>
              <p className="text-2xl font-bold">{event.available_seats} / {event.max_capacity}</p>
            </div>
            <button
              onClick={register}
              disabled={busy || event.available_seats <= 0}
              className="btn-primary"
            >
              {event.available_seats <= 0 ? "Sold out" : busy ? "Registering…" : "Register"}
            </button>
          </div>
          {msg && <p className="mt-4 text-sm text-slate-700">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
