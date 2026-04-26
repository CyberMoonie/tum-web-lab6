# Lab 6 - Shelf of Alexandria

Shelf of Alexandria is a client-side movie watchlist app built with React and Vite. It keeps the whole UI in the browser, stores the shelf and theme in localStorage, and lets the user manage a compact set of movie entities.

## Topic

The topic is a personal movie shelf. It was chosen because it is simple enough for a lab project, but still gives enough room for the required interactions: add, remove, like, and filter.

## What the app does

- Add a movie with title, genre, and release year.
- Mark a movie as a favorite.
- Mark a movie as watched or unwatched.
- Remove movies from the shelf.
- Filter by search text, genre, status, and sort order.
- Use a dark-only visual theme with a red and bluish-black palette.
- Persist movies in the browser with localStorage.

## Flows

1. Add a movie.
   - Fill in the form.
   - Press Add movie.
   - The new card appears at the top of the list.

2. Organize the shelf.
   - Use the heart button to mark favorites.
   - Use the watched button to track viewing status.
   - Remove movies that are no longer needed.

3. Find a movie quickly.
   - Search by title, year, or genre.
   - Narrow the shelf with genre and status filters.
   - Change the sort order when the list grows.

## Tech stack

- React
- Vite
- CSS with custom theme variables and responsive layout
- localStorage for persisted client state

## Deployment

The app is prepared for static hosting on GitHub Pages through the Vite build output.

## How to run locally

1. Open a terminal in `lab6/tum-web-lab6`.
2. Install dependencies with `npm install`.
3. Start the dev server with `npm run dev`.
4. Open the local URL shown by Vite, usually `http://localhost:5173`.

To verify the production build, run `npm run build`. The output is written to `dist/`.
