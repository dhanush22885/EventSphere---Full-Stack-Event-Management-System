import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EventsAPI } from "../services/endpoints";

const EMPTY = {
  title: "", description: "", category: "Technology", image_url: "",
  venue: "", location: "",
  start_date: "", end_date: "", start_time: "09:00", end_time: "17:00",
  max_capacity: 100,
};

export function EventForm({ initial = EMPTY, onSubmit, submitLabel = "Save" }) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) =>
    setForm({ ...form, [k]: k === "max_capacity" ? Number(e.target.value) : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try { await onSubmit(form); }
    catch (err) { setError(err?.response?.data?.detail || "Save failed"); }
    finally { setBusy(false); }
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-6">
      {error && <div className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      <div><label className="label">Title</label>
        <input className="input" required value={form.title} onChange={set("title")} /></div>
      <div><label className="label">Description</label>
        <textarea className="input min-h-[120px]" required value={form.description} onChange={set("description")} /></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div><label className="label">Category</label>
          <input className="input" required value={form.category} onChange={set("category")} /></div>
        <div><label className="label">Image URL</label>
          <input className="input" value={form.image_url || ""} onChange={set("image_url")} /></div>
        <div><label className="label">Venue</label>
          <input className="input" required value={form.venue} onChange={set("venue")} /></div>
        <div><label className="label">Location</label>
          <input className="input" required value={form.location} onChange={set("location")} /></div>
        <div><label className="label">Start date</label>
          <input className="input" type="date" required value={form.start_date} onChange={set("start_date")} /></div>
        <div><label className="label">End date</label>
          <input className="input" type="date" required value={form.end_date} onChange={set("end_date")} /></div>
        <div><label className="label">Start time</label>
          <input className="input" type="time" required value={form.start_time} onChange={set("start_time")} /></div>
        <div><label className="label">End time</label>
          <input className="input" type="time" required value={form.end_time} onChange={set("end_time")} /></div>
        <div><label className="label">Max capacity</label>
          <input className="input" type="number" min={1} required value={form.max_capacity} onChange={set("max_capacity")} /></div>
      </div>
      <button className="btn-primary" disabled={busy}>{busy ? "Saving…" : submitLabel}</button>
    </form>
  );
}

export default function CreateEvent() {
  const nav = useNavigate();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Create event</h1>
      <EventForm
        submitLabel="Create event"
        onSubmit={async (form) => {
          await EventsAPI.create(form);
          nav("/organizer");
        }}
      />
    </div>
  );
}