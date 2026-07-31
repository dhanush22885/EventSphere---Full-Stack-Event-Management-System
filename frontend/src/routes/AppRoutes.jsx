import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";

import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import EventList from "../pages/EventList.jsx";
import EventDetails from "../pages/EventDetails.jsx";
import UserDashboard from "../pages/UserDashboard.jsx";
import OrganizerDashboard from "../pages/OrganizerDashboard.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import CreateEvent from "../pages/CreateEvent.jsx";
import EditEvent from "../pages/EditEvent.jsx";
import Profile from "../pages/Profile.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/events/:id" element={<EventDetails />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer"
          element={
            <ProtectedRoute roles={["ORGANIZER", "ADMIN"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/new"
          element={
            <ProtectedRoute roles={["ORGANIZER", "ADMIN"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute roles={["ORGANIZER", "ADMIN"]}>
              <EditEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}