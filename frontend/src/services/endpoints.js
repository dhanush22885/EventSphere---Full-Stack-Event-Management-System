import api from "./api";

export const AuthAPI = {
  async register(payload) {
    const { data } = await api.post("/auth/register", payload);
    return data;
  },
  async login(email, password) {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    const { data } = await api.post("/auth/login", form, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return data;
  },
  async me() {
    const { data } = await api.get("/users/me");
    return data;
  },
  async updateMe(payload) {
    const { data } = await api.put("/users/me", payload);
    return data;
  },
};

export const EventsAPI = {
  list: (params) => api.get("/events", { params }).then((r) => r.data),
  get: (id) => api.get(`/events/${id}`).then((r) => r.data),
  create: (payload) => api.post("/events", payload).then((r) => r.data),
  update: (id, payload) => api.put(`/events/${id}`, payload).then((r) => r.data),
  remove: (id) => api.delete(`/events/${id}`),
  mine: () => api.get("/events/mine/organized").then((r) => r.data),
  participants: (id) => api.get(`/events/${id}/participants`).then((r) => r.data),
};

export const RegistrationsAPI = {
  register: (eventId) => api.post(`/registrations/${eventId}`).then((r) => r.data),
  cancel: (eventId) => api.delete(`/registrations/${eventId}`),
  mine: () => api.get("/registrations/me").then((r) => r.data),
};

export const AdminAPI = {
  users: () => api.get("/admin/users").then((r) => r.data),
  stats: () => api.get("/admin/stats").then((r) => r.data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),
};
