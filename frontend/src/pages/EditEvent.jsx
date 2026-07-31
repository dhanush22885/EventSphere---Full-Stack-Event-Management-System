import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EventsAPI } from "../services/endpoints";
import { EventForm } from "./CreateEvent";
import Loading from "../components/Loading";

export default function EditEvent() {
  const { id } = useParams();
  const nav = useNavigate();
  const [initial, setInitial] = useState(null);

  useEffect(() => {
    EventsAPI.get(id).then((e) => {
      setInitial({
        title: e.title, description: e.description, category: e.category,
        image_url: e.image_url || "", venue: e.venue, location: e.location,
        start_date: e.start_date, end_date: e.end_date,
        start_time: e.start_time, end_time: e.end_time,
        max_capacity: e.max_capacity,
      });
    });
  }, [id]);

  if (!initial) return <Loading />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit event</h1>
      <EventForm
        initial={initial}
        submitLabel="Save changes"
        onSubmit={async (form) => {
          await EventsAPI.update(id, form);
          nav("/organizer");
        }}
      />
    </div>
  );
}
