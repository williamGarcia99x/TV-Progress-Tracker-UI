# Popcorn Watchers 🍿

A modern web application for tracking your TV show progress, built with Next.js, React, and Tailwind CSS. This project allows users to search, discover, and track TV shows using data from [The Movie Database (TMDB)](https://www.themoviedb.org/).

---

## Project Overview

Popcorn Watchers is designed to help users:

- Discover trending, popular, and top-rated TV shows.
- Search for TV shows and movies using TMDB's API.
- Track their viewing progress, rate shows, and add personal notes.
- View and edit their tracked shows in a user-friendly interface.

---

## Features

- **Trending, Popular, and Top Rated Carousels:** Browse curated lists of TV shows.
- **Show Details Page:** View detailed information, including genres, ratings, and overviews.
- **User Tracking:** Track episodes/seasons watched, add ratings and notes, and edit your progress.
- **Authentication:** Secure login and logout with persistent sessions.
- **Responsive UI:** Clean, modern design with Tailwind CSS and shadcn/ui components.
- **Blurred Backdrops:** Visually appealing backgrounds using show images.
- **Server Actions & Caching:** Fast, up-to-date data with Next.js App Router and React Server Components.

---

## Tech Stack

- **Framework:** [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/)
- **State/Data:** React Query, React Server Components, Next.js Server Actions
- **API:** [TMDB API](https://www.themoviedb.org/documentation/api)
- **Authentication:** Cookie-based sessions
- **Other:** React Icons, react-hot-toast

---

## Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-username/tv-progress-tracker-ui.git
cd tv-progress-tracker-ui
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Get a TMDB API Key**

- Create a free account at [TMDB](https://www.themoviedb.org/).
- Go to your account settings > API > Request an API key.
- Copy your API key.

### 4. **Configure Environment Variables**

Create a `.env.local` file at the root of the project and add:

```text
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_API_KEY= your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

Replace `your_tmdb_api_key_here` with your actual TMDB API key.

### 5. **Run the Development Server**

```bash
npm run dev
# or
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Additional Notes

- **Backend:** This project requires a backend API for user authentication and tracking endpoints.  
  You must also **clone and run the backend repo separately**: [TV-Progress-Tracker (Backend API)](https://github.com/williamGarcia99x/TV-Progress-Tracker.git).  
  **Do not clone it inside this repository**—keep it as a separate project folder to avoid nesting repos.  
  Update `NEXT_PUBLIC_API_BASE_URL` in your `.env.local` as needed to match your backend server address.
- **TMDB Usage:** All show/movie data is fetched from TMDB. You must comply with their [terms of use](https://www.themoviedb.org/terms-of-use).
- **Custom Styling:** Colors and UI are customizable via Tailwind config and CSS variables.

---

## 🤝 Contributing

Pull requests and issues are welcome! Please open an issue to discuss your ideas or report bugs.

---

**Enjoy tracking your TV shows!**
