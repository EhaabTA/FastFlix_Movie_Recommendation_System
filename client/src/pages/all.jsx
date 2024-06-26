import React, { useEffect, useState } from "react";
import axios from "axios";
import Cards from "../components/card/card";
import { Link } from "react-router-dom";

const All = () => {
  const [movies, setMovies] = useState([]);
  const [sortBy, setSortBy] = useState("metascore"); // Default sort by metascore
  const [filterByGenre, setFilterByGenre] = useState("All"); // Default filter by All genres

  useEffect(() => {
    const fetchAllMovies = async () => {
      try {
        const res = await axios.get("http://localhost:8800/imdb");
        setMovies(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllMovies();
  }, []);

  // Function to sort movies based on the selected criteria
  const sortMovies = (criteria) => {
    setSortBy(criteria);

    // Implement the sorting logic based on the selected criteria
    const sortedMovies = [...movies].sort((a, b) => {
      if (criteria === "metascore") {
        // Sort by metascore, use imdb_rating if metascore is the same
        if (a.Meta_score !== b.Meta_score) {
          return b.Meta_score - a.Meta_score; // Descending order
        } else {
          return b.IMDB_Rating - a.IMDB_Rating;
        }
      } else if (criteria === "imdb_rating") {
        // Sort by imdb_rating, use metascore if imdb_rating is the same
        if (a.IMDB_Rating !== b.IMDB_Rating) {
          return b.IMDB_Rating - a.IMDB_Rating; // Descending order
        } else {
          return b.Meta_score - a.Meta_score;
        }
      }
      // Default sorting (you can adjust this based on your needs)
      return 0;
    });
    // Update the 'movies' state with the sorted list
    setMovies(sortedMovies);
  };

  // Function to filter movies based on genre
  const filterMoviesByGenre = (genre) => {
    setFilterByGenre(genre);
    // Implement the filtering logic based on the selected genre
    const filteredMovies = genre === "All" ? movies : movies.filter(movie => movie.Genre.includes(genre));
    // Update the 'movies' state with the filtered list
    setMovies(filteredMovies);
  };


  return (
    <div className="movie__list">
      <h2 className="list__title">ALL MOVIES</h2>
      <div className="filters" style={{ color: "white" }}>
        <label htmlFor="sort" style={{ color: "white" }} className="lab">Sort By: </label>
        <select className="sel"
          id="sort"
          value={sortBy}
          onChange={(e) => sortMovies(e.target.value)}
        >
          <option value="metascore">All</option>
          <option value="metascore">Metacritic Score</option>
          <option value="imdb_rating">IMDb Rating</option>
          {/* Add other sorting criteria if needed */}
        </select>
        <label htmlFor="filter" style={{ color: "white" }}>Filter By Genre: </label>
        <select
          id="filter"
          value={filterByGenre}
          onChange={(e) => filterMoviesByGenre(e.target.value)}
        >
          <option value="All">All Genres</option>
          <option value="Drama">Drama</option>
          <option value="Crime">Crime</option>
          <option value="Action">Action</option>
          <option value="Adventure">Adventure</option>
          <option value="Biography">Biography</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Romance">Romance</option>
          <option value="Fantasy">Fantasy</option>
          <option value="Comedy">Comedy</option>
          <option value="Animation">Animation</option>
          {/* Add other genre options based on your movie data */}
        </select>
      </div>
      <div className="list__cards">
        {movies.map((movie) => (
          <Cards key={movie.id} movie={movie} />
        ))}
      </div>
      <button className="addHome">
        <Link
          to="/add"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Add new movie
        </Link>
      </button>
    </div>
  );
};

export default All;
