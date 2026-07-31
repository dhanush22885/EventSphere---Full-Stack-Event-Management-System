import { Link } from "react-router-dom";
import { formatDate } from "../utils/format";
import { getEventImage } from "../utils/categoryImages";

const FALLBACK = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200";

export default function EventCard({ event }) {
  return (
    <Link
      to={`/events/${event.id}`}
      className="card group overflow-hidden transition-transform hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={getEventImage(event)}
          alt={event.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
          onError={(e) => {
          e.currentTarget.src = "/images/default.jpg";
         }}
        />
      </div>
      <div className="space-y-2 p-4">
        <span className="inline-block rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
          {event.category}
        </span>
        <h3 className="line-clamp-1 text-lg font-semibold">{event.title}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{event.description}</p>
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <span>📍 {event.location}</span>
          <span>📅 {formatDate(event.start_date)}</span>
        </div>
        <div className="text-xs font-medium text-slate-700">
          {event.available_seats} / {event.max_capacity} seats available
        </div>
      </div>
    </Link>
  );
}