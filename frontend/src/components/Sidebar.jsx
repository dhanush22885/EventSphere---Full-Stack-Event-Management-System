import { NavLink } from "react-router-dom";

export default function Sidebar({ items }) {
  return (
    <aside className="w-full shrink-0 md:w-60">
      <nav className="card p-2">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {it.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}