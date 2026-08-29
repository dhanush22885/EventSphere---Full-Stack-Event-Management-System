🌐 EventSphere — Event Management Platform

EventSphere is a full-stack event management platform that connects event organizers and users through a role-based web application.

Organizers can create and manage events, while users can discover available events, register for events, and track their registrations through a personalized dashboard.

The application is built with a modern React.js + FastAPI + PostgreSQL architecture and is deployed using Vercel, Render, and Neon PostgreSQL.

🚀 Live Demo

🔗 Live Application: (https://event-sphere-svwh.vercel.app/)




✨ Key Features
🔐 Role-Based Authentication
User and Organizer roles
Secure login and authentication
Role-based access to application features
Different dashboards and capabilities based on the logged-in role
👨‍💼 Organizer Features

Organizers can:

Create new events
Add event details such as title, description, date, time, venue, and capacity
View and manage created events
Monitor event registrations
Manage their event-related information
👤 User Features

Users can:

Browse available events
View event details
Register for events
Track registered events
View their activities through the dashboard
📊 Dashboard

The dashboard provides a centralized view of:

Available events
Created events for organizers
Registered events for users
Event information
User/organizer activities
📅 Event Management
Create and publish events
View event details
Event registration
Registration tracking
Role-specific event management
📱 Responsive Interface

The frontend is designed using Tailwind CSS to provide a responsive and modern user interface across desktop, tablet, and mobile devices.

🏗️ Application Workflow
                    EventSphere
                         │
                         ▼
                    Login / Signup
                         │
                ┌────────┴────────┐
                │                 │
                ▼                 ▼
           Organizer             User
                │                 │
                ▼                 ▼
          Create Event       Browse Events
                │                 │
                ▼                 ▼
         Manage Events       View Details
                                  │
                                  ▼
                            Register Event
                                  │
                                  ▼
                              Dashboard
🧑‍💻 User Roles
Organizer
Login
  ↓
Organizer Dashboard
  ↓
Create Event
  ↓
Publish Event
  ↓
Manage Events
  ↓
View Registrations
User
Login
  ↓
User Dashboard
  ↓
Browse Events
  ↓
View Event Details
  ↓
Register
  ↓
View Registered Events


🛠️ Tech Stack

Frontend
React.js — Component-based UI development
Vite — Fast frontend development and build tool
Tailwind CSS — Responsive and utility-first styling
JavaScript / JSX — Application logic and UI components
HTML5 / CSS3 — Web structure and styling

Backend
Python — Backend programming language
FastAPI — REST API development
Pydantic — Data validation and request/response schemas
SQLAlchemy — Database ORM
REST APIs — Communication between frontend and backend

Database
PostgreSQL — Relational database
Neon PostgreSQL — Cloud-hosted PostgreSQL database

Authentication & Security
Role-based authorization
Password hashing
Secure authentication flow
Protected API endpoints
Input validation

Deployment
Vercel — Frontend deployment
Render — FastAPI backend deployment
Neon — PostgreSQL database hosting

Development Tools
Git
GitHub
Postman
VS Code
