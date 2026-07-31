import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  const dashboardPath =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "ORGANIZER"
      ? "/organizer"
      : "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-brand-600" />
          <span className="text-lg font-bold">EventSphere</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <NavLink to="/events" className="text-sm font-medium text-slate-700 hover:text-brand-600">
            Events
          </NavLink>
          {user && (
            <NavLink to={dashboardPath} className="text-sm font-medium text-slate-700 hover:text-brand-600">
              Dashboard
            </NavLink>
          )}
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Link to="/login" className="btn-outline">Login</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className="hidden text-sm text-slate-700 sm:block">
                {user.full_name}
              </Link>
              <button
                onClick={() => {
                  logout();
                  nav("/");
                }}
                className="btn-outline"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}