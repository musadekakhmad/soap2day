"use client";

import { useState, useEffect } from "react";
import MovieList from "../components/MovieList";
import { 
  getMoviesByCategory, 
  getTvSeriesByCategory
} from "../lib/api";

const MOVIE_CATEGORIES = [
  { key: "popular", title: "Popular Movies" },
  { key: "now_playing", title: "Now Playing" },
  { key: "upcoming", title: "Upcoming" },
  { key: "top_rated", title: "Top Rated" },
];

const TV_CATEGORIES = [
  { key: "popular", title: "Popular TV Series" },
  { key: "airing_today", title: "Airing Today" },
  { key: "on_the_air", title: "On The Air" },
  { key: "top_rated", title: "Top Rated" },
];

export default function Home() {
  const [movieData, setMovieData] = useState([]);
  const [tvData, setTvData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    setLoading(true);
    const initialMoviePromises = MOVIE_CATEGORIES.map(category =>
      getMoviesByCategory(category.key, 1)
    );
    const initialTvPromises = TV_CATEGORIES.map(category =>
      getTvSeriesByCategory(category.key, 1)
    );

    const [movieResults, tvResults] = await Promise.all([
      Promise.all(initialMoviePromises),
      Promise.all(initialTvPromises)
    ]);

    setMovieData(movieResults.map(results => results.slice(0, 6)));
    setTvData(tvResults.map(results => results.slice(0, 6)));
    setLoading(false);
  };

  const loadMoreMovies = async (categoryKey, categoryIndex) => {
    setLoading(true);
    const currentPage = movieData[categoryIndex].length / 6;
    const newPage = currentPage + 1;
    const moreMovies = await getMoviesByCategory(categoryKey, newPage);
    
    setMovieData(prevData => {
      const newData = [...prevData];
      newData[categoryIndex] = [...newData[categoryIndex], ...moreMovies.slice(0, 6)];
      return newData;
    });
    setLoading(false);
  };

  const loadMoreTv = async (categoryKey, categoryIndex) => {
    setLoading(true);
    const currentPage = tvData[categoryIndex].length / 6;
    const newPage = currentPage + 1;
    const moreTv = await getTvSeriesByCategory(categoryKey, newPage);
    
    setTvData(prevData => {
      const newData = [...prevData];
      newData[categoryIndex] = [...newData[categoryIndex], ...moreTv.slice(0, 6)];
      return newData;
    });
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return (
    <main className="min-h-screen p-8 bg-slate-900 text-white">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-blue-400 mb-4 drop-shadow-lg">
        Soap2day
      </h1>
      <p className="text-xl md:text-2xl text-center text-gray-300 mb-12">
        Soap2day is your one-stop destination for free movies, TV shows, and web series. Download thousands of titles in HD quality, with unlimited access to the latest blockbusters and trending series. Start your free entertainment journey today!
      </p>

      {loading ? (
        <p className="text-center text-gray-400">Loading data...</p>
      ) : (
        <>
          {/* Render movie categories */}
          {MOVIE_CATEGORIES.map((category, index) => (
            <div key={category.key} className="mb-12">
              <h2 className="text-4xl font-bold mb-4 text-center">
                {category.title}
              </h2>
              <MovieList movies={movieData[index]} />
              <div className="text-center mt-6">
                <button
                  onClick={() => loadMoreMovies(category.key, index)}
                  className="px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-white bg-blue-600 hover:bg-red-700"
                >
                  Load More
                </button>
              </div>
            </div>
          ))}

          <hr className="my-12 border-gray-700" />

          {/* Render TV series categories */}
          {TV_CATEGORIES.map((category, index) => (
            <div key={category.key} className="mb-12">
              <h2 className="text-4xl font-bold mb-4 text-center">
                {category.title}
              </h2>
              <MovieList movies={tvData[index]} />
              <div className="text-center mt-6">
                <button
                  onClick={() => loadMoreTv(category.key, index)}
                  className="px-6 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105 shadow-lg text-white bg-red-600 hover:bg-blue-700"
                >
                  Load More
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </main>
  );
}
