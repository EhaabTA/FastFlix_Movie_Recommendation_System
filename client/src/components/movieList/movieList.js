import React, { useEffect, useState } from "react";
import "./movieList.css";
import Cards from "../card/card";
import axios from "axios";

const MovieList = () => {
    const [imdb_top_1000, setMovieList] = useState([]);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const res = await axios.get("http://localhost:8800/popular");
                setMovieList(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchMovieData();
    }, []);

    return (
        <div className="movie__list">
            <h2 className="list__title">POPULAR</h2>
            <div className="list__cards">
                {imdb_top_1000.map((movie) => (
                    <Cards key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default MovieList;
