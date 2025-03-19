"use client";

import { useState, useEffect, useCallback } from "react";
import MovieList from "../components/MovieList";
import Pagination from "../components/Pagination";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited: boolean;
  watchLater: boolean;
}

export default function WatchLaterPage({
  refreshActivities = () => {},
}: {
  refreshActivities?: () => void;
}) {
  const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches watch later movies from the API.
   */
  const fetchWatchLaterMovies = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/watch-later?page=${currentPage}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setWatchLaterMovies(data.watchLater || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching watch later movies:", err);
      setError("Failed to load watch later movies. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

  /**
   * Fetch data when the page changes.
   */
  useEffect(() => {
    fetchWatchLaterMovies();
  }, [fetchWatchLaterMovies]);

  /**
   * Handles page changes.
   */
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [currentPage]);

  /**
   * Toggles watch later status of a movie.
   */
  const toggleWatchLater = useCallback(
    async (movieId: string) => {
      try {
        const movie = watchLaterMovies.find((m) => m.id === movieId);
        if (!movie) return;

        const method = movie.watchLater ? "DELETE" : "POST";
        const response = await fetch(`/api/watch-later/${movieId}`, { method });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to toggle Watch Later.");
        }

        fetchWatchLaterMovies();
        refreshActivities();
      } catch (err) {
        console.error("Error toggling watch later:", err);
        setError("Failed to update Watch Later status.");
      }
    },
    [watchLaterMovies, fetchWatchLaterMovies, refreshActivities]
  );

  /**
   * Toggles favorite status of a movie.
   */
  const toggleFavorite = useCallback(
    async (movieId: string) => {
      try {
        const movie = watchLaterMovies.find((m) => m.id === movieId);
        if (!movie) return;

        const method = movie.favorited ? "DELETE" : "POST";
        const response = await fetch(`/api/favorites/${movieId}`, { method });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to toggle favorite.");
        }

        fetchWatchLaterMovies();
        refreshActivities();
      } catch (err) {
        console.error("Error toggling favorite:", err);
        setError("Failed to update favorite status.");
      }
    },
    [watchLaterMovies, fetchWatchLaterMovies, refreshActivities]
  );

  return (
    <main aria-labelledby="watch-later-title">
      <h1
        id="watch-later-title"
        className="text-4xl md:text-5xl font-bold text-center text-white mb-8 py-10 mt-5"
      >
        Watch Later
      </h1>

      <section aria-live="polite" aria-busy={isLoading} role="region">
        {isLoading ? (
          <p className="text-white text-lg font-semibold" role="alert">
            Loading watch later movies...
          </p>
        ) : error ? (
          <p className="text-red-500 text-lg font-semibold" role="alert">
            {error}
          </p>
        ) : watchLaterMovies.length > 0 ? (
          <MovieList
            movies={watchLaterMovies}
            toggleWatchLater={toggleWatchLater}
            toggleFavorite={toggleFavorite}
          />
        ) : (
          <p className="text-white text-lg font-semibold" role="alert">
            No movies in watch later list.
          </p>
        )}
      </section>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}