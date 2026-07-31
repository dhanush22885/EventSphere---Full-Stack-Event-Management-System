export function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const d = new Date();
  d.setHours(+h, +m, 0, 0);
  return d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}