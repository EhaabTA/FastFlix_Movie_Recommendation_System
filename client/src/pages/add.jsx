import React, { useEffect, useState } from "react";
// import "./home.css";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Link } from "react-router-dom";
import axios from "axios";

const Add = () => {
    const [imdb_top_1000, setPopularMovies] = useState([]);

    useEffect(() => {
        const FunctionTest = async () => {
            try {
                const res = await axios.get("http://localhost:8800/imdb");
                console.log(res);
                setPopularMovies(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        FunctionTest();
    }, []);
    return (
        <>
            <div className="poster" >
                <Carousel
                    showThumbs={false}
                    autoPlay={true}
                    transitionTime={3}
                    infiniteLoop={true}
                    showStatus={false}
                >
                    {
                        imdb_top_1000.map(movie => (
                            <div className="movies2" key={movie.id}>
                                <Link style={{ textDecoration: "none", color: "white" }} to={`/movie/${movie.id}`} >
                                    <div className="posterImage">
                                        <img src={movie ? movie.Poster_Link : " "} alt="" />
                                    </div>
                                    <div className="posterImage__overlay" >
                                        <div className="posterImage__title">{movie.Series_Title}</div>
                                        <div className="posterImage__runtime">
                                            {movie ? movie.Runtime : ""}
                                            <span className="posterImage__rating">
                                                {movie ? movie.IMDB_Rating : ""}
                                                <i className="fas fa-star" />{" "}
                                            </span>
                                        </div>
                                        <div className="posterImage__description">{movie ? movie.Genre : ""}</div>
                                    </div>
                                </Link></div>
                        ))
                    }
                </Carousel>
                {/* <MovieList /> */}
            </div>
        </>
    );
};


export default Add;