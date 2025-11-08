# Favorite Quotes

Erik B - Favorite quote W02 - "If you choose not to decide, you still have made a choice". RUSH - Freewill

Kerri M - Favorite quote W02 - "The Most important decisions we make is whether we believe in a friendly or hostile universe." - Albert Einstein

## More stuff

# Podcastic
_A modern web-based podcast discovery and listening app built with React, TypeScript, and the PodcastIndex API._

### CSE 499 Senior Project  
**Team:** Kerri Morris & Erik Burton  
**Course:** CSE 499 — Senior Project  
**Term:** Fall 2025  

---

## Overview
**Podcastic** is a single-page web application that enables users to discover, search, and listen to podcasts through the [PodcastIndex.org](https://podcastindex.org/) API.  

The app features:
- A **Trending** home view that showcases popular podcasts  
- Automatic **light/dark theme** following the user’s system preference  
- **Search** functionality by title or author  
- **Detailed podcast pages** with episodes and metadata  
- An integrated **audio player** with core playback controls  
- Personal **collections** (Library, Favorites, Queue) stored in LocalStorage and later synced to MongoDB  
- Optional **user accounts and backend sync** for cross-device data  

---

## Requirements & User Stories

| Requirement | C/E* | Description |
|--------------|:----:|-------------|
| **Home View** | C | Home page displaying a top navigation bar and a main section showing a “Trending” (random slice) of podcasts. |
| **Light/Dark Mode** | C | The UI automatically matches the system’s light or dark theme preference. |
| **Discover (Search)** | C | The top navigation includes a search bar connected to PodcastIndex.org, allowing users to search by title or author. |
| **Podcast Detail** | C | Displays artwork, author, description, and an episode list for a single podcast. |
| **Audio Player** | C | Provides playback for episodes (play/pause, seek bar, duration). |
| **Personal Collection** | C | Allows users to save podcasts (Library), episodes (Favorites), and build a play Queue; data is persisted locally. |
| **Database** | C | Adds a MongoDB backend for permanent storage of personal collections. |
| **Accounts** | E | Enables user registration/login and cloud-synced data for persistent access. |
| **Advanced Player Controls** | E | Adds skip ± 15 s, next/previous episode, and auto-advance in queue. |

*C = Core, E = Enhancement*

---

### User Stories (Highlights)

| Name | Description |
|------|--------------|
| **Trending** | As a user, I want to land on the site and see trending podcasts so I can start exploring quickly. |
| **Light/Dark** | As a user, I want the site to match my system theme so it feels consistent. |
| **Search** | As a user, I want to search for a podcast so I can find shows I care about. |
| **Detail** | As a user, I want to click a podcast and see details and episodes so I can pick one to play. |
| **Play/Pause** | As a user, I want to play or pause an episode to control my listening. |
| **Library** | As a user, I want to save podcasts to my library for later viewing. |
| **Favorites** | As a user, I want to save episodes to a favorites list for easy access. |
| **Queue** | As a user, I want to add episodes to a queue so they play one after another. |
| **Database** | As a user, I want permanent storage so my collections persist between visits. |
| **Registration/Login** | As a user, I want to register or log in to sync my collections across devices. |
| **Advanced Controls** | As a user, I want to skip ± 15 s, go to next/previous episodes, or auto-advance in the queue. |

---

## Project Schedule (4 Sprints)

| Sprint | Milestones |
|:------:|-------------|
| **1** | Setup app, routing, global theme (system light/dark). Home page with Trending (stub or real API). Audio player stub. LocalStorage helpers. Basic UI shell (navbar/layout). |
| **2** | Search input wired to PodcastIndex.org. Podcast Detail page with episode list. Replace player stub with real player: play/pause, time/duration, seek bar. |
| **3** | Create Library, Favorites, and Queue screens. Add buttons to add/remove from collections. Persist all data in LocalStorage. |
| **4** | Error/loading states, empty UX, bug fixes. Add MongoDB database. Add Account registration/login with backend sync. Prepare final demo and deploy to cloud. |

---

## Architecture

**Type:** Web application (SPA) with client-side routing and API data fetch.  
**Architecture Pattern:** Client–Server with optional backend.

### Layers
- **UI Layer:** React pages (Home, Search, Podcast Detail, Collections) + reusable components (PodcastCard, AudioPlayer, QueuePanel).  
- **State Layer:** Zustand store for global theme, playback state, and user collections.  
- **Persistence Layer:** LocalStorage (MVP) → MongoDB (enhancement).  
- **Backend Layer:** Node.js / Express API for accounts, sync, and permanent storage.  
- **External Data:** PodcastIndex.org REST API for podcast discovery.

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React 18 + Vite + TypeScript |
| **Styling** | Tailwind CSS + prefers-color-scheme |
| **Audio** | HTML5 `<audio>` element (native browser support) |
| **State Management** | Zustand (lightweight global store) |
| **Persistence (MVP)** | LocalStorage |
| **Database (Enhancement)** | MongoDB (via Mongoose) |
| **Backend (Enhancement)** | Node.js + Express + TypeScript |
| **API** | PodcastIndex REST API |
| **Cloud Hosting** | Vercel or Render (for frontend + backend) |
| **Tooling** | ESLint / Prettier / Vitest for quality and testing |

---

## Setup & Run

### 1️Clone the Repository
```bash
git clone https://github.com/yourusername/podcastic.git
cd podcastic
