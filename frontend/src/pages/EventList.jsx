import { useEffect, useState } from "react";
import { EventsAPI } from "../services/endpoints";
import EventCard from "../components/EventCard";
import Loading, { EmptyState } from "../components/Loading";

const CATEGORIES = ["", "Technology", "Business", "Music", "Workshop", "Sports", "Other"];

export default function EventList() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, page_size: 12 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", category: "", location: "", date_from: "" });
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params = { page, page_size: 12 };
    Object.entries(filters).forEach(([k, v]) => v && (params[k] = v));
    EventsAPI.list(params)
      .then(setData)
      .finally(() => setLoading(false));
  }, [filters, page]);

  const set = (k) => (e) => {
    setPage(1);
    setFilters({ ...filters, [k]: e.target.value });
  };

  const totalPages = Math.max(1, Math.ceil(data.total / data.page_size));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold">Discover events</h1>
      <p className="mt-1 text-sm text-slate-500">Search and filter across all upcoming events.</p>

      <div className="card mt-6 grid gap-3 p-4 md:grid-cols-4">
        <input className="input" placeholder="Search…" value={filters.search} onChange={set("search")} />
        <select className="input" value={filters.category} onChange={set("category")}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c || "All categories"}</option>
          ))}
        </select>
        <input className="input" placeholder="Location" value={filters.location} onChange={set("location")} />
        <input className="input" type="date" value={filters.date_from} onChange={set("date_from")} />
      </div>

      <div className="mt-8">
        {loading ? (
          <Loading />
        ) : data.items.length === 0 ? (
          <EmptyState title="No events match your filters" description="Try broadening your search." />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.items.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button className="btn-outline" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <span className="text-sm text-slate-600">Page {page} / {totalPages}</span>
          <button className="btn-outline" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}