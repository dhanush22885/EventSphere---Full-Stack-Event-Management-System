export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 text-sm text-slate-500">
        <p>© {new Date().getFullYear()} EventSphere</p>
        <p>Built with React, FastAPI & Supabase</p>
      </div>
    </footer>
  );
}