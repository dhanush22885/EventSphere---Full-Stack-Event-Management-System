const categoryImages = {
  Technology: "/images/technology.jpg",
  Sports: "/images/sports.jpg",
  Workshop: "/images/workshop.jpg",
  Conference: "/images/conference.jpg",
  Seminar: "/images/seminar.jpg",
  Hackathon: "/images/hackathon.jpg",
  Business: "/images/business.jpg",
  Networking: "/images/networking.jpg",
  Education: "/images/education.jpg",
  Cultural: "/images/cultural.jpg",
  Music: "/images/music.jpg",
  Dance: "/images/dance.jpg",
  Movies: "/images/movies.jpg",
  Gaming: "/images/gaming.jpg",
  Art: "/images/art.jpg",
  Food: "/images/food.jpg",
  Health: "/images/health.jpg",
  Charity: "/images/charity.jpg",
  Festival: "/images/festival.jpg",
  Startup: "/images/startup.jpg",
  Science: "/images/science.jpg",
  Environment: "/images/environment.jpg",
  Travel: "/images/travel.jpg",
  Default: "/images/default.jpg",
};

export function getEventImage(event) {
  if (event.image_url && event.image_url.trim() !== "") {
    return event.image_url;
  }

  return categoryImages[event.category] || categoryImages.Default;
}