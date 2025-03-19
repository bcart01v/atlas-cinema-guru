"use client";

import MovieCard from "./MovieCard";

interface Movie {
  id: string;
  title: string;
  synopsis: string;
  released: number;
  genre: string;
  favorited?: boolean;
  watchLater?: boolean;
}

interface MovieListProps {
  movies: Movie[];
  toggleFavorite?: (movieId: string) => void;
  toggleWatchLater?: (movieId: string) => void;
}

const MovieList: React.FC<MovieListProps> = ({
  movies = [],
  toggleFavorite,
  toggleWatchLater,
}) => {
  return (
    <>
      {/* ✅ Moved heading outside the section for better semantic structure */}
      <h2 id="movie-list-heading" className="sr-only">
        Movie List
      </h2>

      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mx-5 md:mx-10"
        aria-labelledby="movie-list-heading"
        role="list"
      >
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              toggleFavorite={toggleFavorite}
              toggleWatchLater={toggleWatchLater}
            />
          ))
        ) : (
          <p
            className="text-teal py-10 text-lg font-semibold ps-2"
            aria-live="assertive"
            role="alert"
            tabIndex={0}
          >
            No movies found.
          </p>
        )}
      </section>
    </>
  );
};

export default MovieList;