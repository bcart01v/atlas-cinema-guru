"use client";

import { useState, useEffect } from "react";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited?: boolean;
  watchLater?: boolean;
}

interface MovieCardProps {
  movie: Movie;
  toggleFavorite?: (movieId: string) => void;
  toggleWatchLater?: (movieId: string) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  toggleFavorite,
  toggleWatchLater,
}) => {
  const [isFavorited, setIsFavorited] = useState(movie.favorited || false);
  const [isWatchLater, setIsWatchLater] = useState(movie.watchLater || false);
  const [isLoadingFavorite, setIsLoadingFavorite] = useState(false);
  const [isLoadingWatchLater, setIsLoadingWatchLater] = useState(false);

  useEffect(() => {
    setIsFavorited(movie.favorited || false);
    setIsWatchLater(movie.watchLater || false);
  }, [movie.favorited, movie.watchLater]);

  const handleFavoriteToggle = async () => {
    if (isLoadingFavorite) return;
    setIsLoadingFavorite(true);

    try {
      await fetch(`/api/favorites/${movie.id}`, {
        method: isFavorited ? "DELETE" : "POST",
      });
      setIsFavorited(!isFavorited);
      if (toggleFavorite) toggleFavorite(movie.id);
    } catch (error) {
      console.error("Error updating favorites:", error);
    } finally {
      setIsLoadingFavorite(false);
    }
  };

  const handleWatchLaterToggle = async () => {
    if (isLoadingWatchLater) return;
    setIsLoadingWatchLater(true);

    try {
      await fetch(`/api/watch-later/${movie.id}`, {
        method: isWatchLater ? "DELETE" : "POST",
      });
      setIsWatchLater(!isWatchLater);
      if (toggleWatchLater) toggleWatchLater(movie.id);
    } catch (error) {
      console.error("Error updating watch later:", error);
    } finally {
      setIsLoadingWatchLater(false);
    }
  };

  return (
    <div
      className="relative group border-teal border-2 rounded-lg overflow-hidden h-[45vh] focus-within:ring-2 focus-within:ring-midnightBlue-300"
      tabIndex={0}
      aria-labelledby={`movie-title-${movie.id}`}
    >
      {/* Movie Image */}
      <img
        src={`/images/${movie.id}.webp`}
        alt={`Poster of ${movie.title}`}
        className="h-full w-full object-cover"
      />

      {/* Favorite & Watch Later Buttons on Hover */}
      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out">
        <button
          className={`h-6 w-6 focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 ${
            isLoadingFavorite ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleFavoriteToggle}
          aria-label={
            isFavorited
              ? `Remove ${movie.title} from favorites`
              : `Add ${movie.title} to favorites`
          }
          aria-pressed={isFavorited}
          disabled={isLoadingFavorite}
        >
          <img
            src={isFavorited ? "/assets/star-solid.svg" : "/assets/star.svg"}
            alt=""
          />
        </button>

        <button
          className={`h-6 w-6 focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 ${
            isLoadingWatchLater ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleWatchLaterToggle}
          aria-label={
            isWatchLater
              ? `Remove ${movie.title} from watch later`
              : `Add ${movie.title} to watch later`
          }
          aria-pressed={isWatchLater}
          disabled={isLoadingWatchLater}
        >
          <img
            src={isWatchLater ? "/assets/clock-solid.svg" : "/assets/clock.svg"}
            alt=""
          />
        </button>
      </div>

      {/* Movie Details on Hover */}
      <div
        className="absolute bottom-0 left-0 w-full max-h-0 overflow-hidden opacity-0 
                   group-hover:max-h-screen group-hover:opacity-100 
                   transition-all duration-500 ease-in-out bg-navy bg-opacity-75 p-4"
      >
        <h3 className="text-lg font-semibold text-white">{movie.title} ({movie.released})</h3>
        <p className="text-sm text-white">{movie.synopsis}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="bg-teal px-2 py-1 rounded-full text-xs text-white">
            {movie.genre}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;