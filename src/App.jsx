import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEYS = {
  movies: 'reelshelf.movies',
};

const GENRES = ['All', 'Drama', 'Sci-Fi', 'Comedy', 'Action', 'Documentary', 'Animation'];
const STATUS_OPTIONS = ['All', 'Favorites', 'Watched', 'To Watch'];
const SORT_OPTIONS = ['Newest first', 'Title A-Z', 'Year descending'];

const seedMovies = [
  {
    id: 'seed-1',
    title: 'Arrival',
    genre: 'Sci-Fi',
    year: '2016',
    liked: true,
    watched: true,
  },
  {
    id: 'seed-2',
    title: 'The Grand Budapest Hotel',
    genre: 'Comedy',
    year: '2014',
    liked: false,
    watched: false,
  },
  {
    id: 'seed-3',
    title: 'Spider-Man: Across the Spider-Verse',
    genre: 'Animation',
    year: '2023',
    liked: true,
    watched: false,
  },
];

function readMoviesFromStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.movies);
    if (!raw) {
      return seedMovies;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedMovies;
  } catch {
    return seedMovies;
  }
}

function App() {
  const [movies, setMovies] = useState(readMoviesFromStorage);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('Drama');
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest first');
  const [message, setMessage] = useState('');

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark';
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.movies, JSON.stringify(movies));
  }, [movies]);

  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setMessage(''), 2400);
    return () => window.clearTimeout(timeoutId);
  }, [message]);

  const filteredMovies = useMemo(() => {
    const query = search.trim().toLowerCase();

    return movies
      .filter((movie) => {
        const matchesSearch =
          !query ||
          movie.title.toLowerCase().includes(query) ||
          movie.genre.toLowerCase().includes(query) ||
          movie.year.includes(query);

        const matchesGenre = genreFilter === 'All' || movie.genre === genreFilter;

        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Favorites' && movie.liked) ||
          (statusFilter === 'Watched' && movie.watched) ||
          (statusFilter === 'To Watch' && !movie.watched);

        return matchesSearch && matchesGenre && matchesStatus;
      })
      .sort((left, right) => {
        if (sortBy === 'Title A-Z') {
          return left.title.localeCompare(right.title);
        }

        if (sortBy === 'Year descending') {
          return Number(right.year) - Number(left.year);
        }

        return movies.indexOf(right) - movies.indexOf(left);
      });
  }, [genreFilter, movies, search, sortBy, statusFilter]);

  const stats = useMemo(() => {
    const watched = movies.filter((movie) => movie.watched).length;
    const favorites = movies.filter((movie) => movie.liked).length;

    return {
      total: movies.length,
      watched,
      favorites,
      toWatch: movies.length - watched,
    };
  }, [movies]);

  function handleAddMovie(event) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedYear = year.trim();
    const currentYear = new Date().getFullYear();
    const numericYear = Number(trimmedYear);

    if (!trimmedTitle) {
      setMessage('Title is required.');
      return;
    }

    if (!Number.isInteger(numericYear) || numericYear < 1888 || numericYear > currentYear + 1) {
      setMessage(`Pick a valid release year between 1888 and ${currentYear + 1}.`);
      return;
    }

    const nextMovie = {
      id: crypto.randomUUID(),
      title: trimmedTitle,
      genre,
      year: trimmedYear,
      liked: false,
      watched: false,
    };

    setMovies((currentMovies) => [nextMovie, ...currentMovies]);
    setTitle('');
    setGenre('Drama');
    setYear(String(currentYear));
    setMessage(`${trimmedTitle} added to the shelf.`);
  }

  function toggleLiked(id) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? { ...movie, liked: !movie.liked } : movie,
      ),
    );
  }

  function toggleWatched(id) {
    setMovies((currentMovies) =>
      currentMovies.map((movie) =>
        movie.id === id ? { ...movie, watched: !movie.watched } : movie,
      ),
    );
  }

  function removeMovie(id) {
    const removedMovie = movies.find((movie) => movie.id === id);
    setMovies((currentMovies) => currentMovies.filter((movie) => movie.id !== id));
    setMessage(`${removedMovie?.title ?? 'Movie'} removed from the shelf.`);
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div>
          <p className="eyebrow">Lab 6 · Client-side app</p>
          <h1>Shelf of Alexandria</h1>
        </div>
      </header>

      <main className="layout">
        <section className="hero card">
          <div>
            <p className="hero-kicker">A simple movie shelf with personality</p>
            <h2>Track movies you want to watch, love, or already finished.</h2>
            <p className="hero-copy">
              Add entries, star favorites, mark watched titles, filter the list, and keep everything in your browser.
            </p>
          </div>

          <div className="stats-grid">
            <article>
              <span>Total</span>
              <strong>{stats.total}</strong>
            </article>
            <article>
              <span>Favorites</span>
              <strong>{stats.favorites}</strong>
            </article>
            <article>
              <span>Watched</span>
              <strong>{stats.watched}</strong>
            </article>
            <article>
              <span>To watch</span>
              <strong>{stats.toWatch}</strong>
            </article>
          </div>
        </section>

        <section className="card form-card">
          <div className="section-head">
            <div>
              <p className="section-label">Add movie</p>
              <h3>Build the shelf</h3>
            </div>
            <span className="section-hint">Stored locally</span>
          </div>

          <form className="movie-form" onSubmit={handleAddMovie}>
            <label>
              <span>Title</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Interstellar" />
            </label>

            <label>
              <span>Genre</span>
              <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                {GENRES.slice(1).map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Year</span>
              <input
                value={year}
                onChange={(event) => setYear(event.target.value)}
                inputMode="numeric"
                placeholder="2024"
              />
            </label>

            <button className="primary-button" type="submit">
              Add movie
            </button>
          </form>

          {message ? <p className="status-message">{message}</p> : null}
        </section>

        <section className="card filters-card">
          <div className="section-head">
            <div>
              <p className="section-label">Filter library</p>
              <h3>Find the right movie</h3>
            </div>
            <span className="section-hint">{filteredMovies.length} visible</span>
          </div>

          <div className="filters-grid">
            <label>
              <span>Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, year, or genre"
              />
            </label>

            <label>
              <span>Genre</span>
              <select value={genreFilter} onChange={(event) => setGenreFilter(event.target.value)}>
                {GENRES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Sort</span>
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {SORT_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        <section className="movies-section">
          {filteredMovies.length > 0 ? (
            <div className="movies-grid">
              {filteredMovies.map((movie, index) => (
                <article className="movie-card card" key={movie.id} style={{ animationDelay: `${index * 70}ms` }}>
                  <div className="movie-card-head">
                    <div>
                      <p className="movie-meta">
                        {movie.genre} · {movie.year}
                      </p>
                      <h3>{movie.title}</h3>
                    </div>

                    <button
                      className={`icon-button ${movie.liked ? 'active' : ''}`}
                      type="button"
                      onClick={() => toggleLiked(movie.id)}
                      aria-pressed={movie.liked}
                      aria-label={movie.liked ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      ♥
                    </button>
                  </div>

                  <div className="movie-tags">
                    <span className={movie.watched ? 'tag tag-success' : 'tag tag-muted'}>
                      {movie.watched ? 'Watched' : 'To watch'}
                    </span>
                    <span className={movie.liked ? 'tag tag-favorite' : 'tag tag-muted'}>
                      {movie.liked ? 'Favorite' : 'Not liked'}
                    </span>
                  </div>

                  <div className="movie-actions">
                    <button type="button" className="secondary-button" onClick={() => toggleWatched(movie.id)}>
                      {movie.watched ? 'Mark as unwatched' : 'Mark as watched'}
                    </button>
                    <button type="button" className="danger-button" onClick={() => removeMovie(movie.id)}>
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <h3>No movies match the current filters.</h3>
              <p>Try clearing a filter or add a new title to keep the shelf moving.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
      </footer>
    </div>
  );
}

export default App;