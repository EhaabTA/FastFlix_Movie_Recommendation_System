import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "./card.css";
import { Link } from "react-router-dom";

const Cards = ({ movie }) => {

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    return <>
        {
            isLoading
                ?
                <div className="cards">
                    <SkeletonTheme color="#FF0101" highlightColor="#444">
                        <Skeleton height={300} duration={2} />
                    </SkeletonTheme>
                </div>
                :
                <Link to={`/movie/${movie.id}`} style={{ textDecoration: "none", color: "white" }}>
                    <div className="cards">
                        <img className="cards__img" src={movie.Poster_Link} onError={(e) => e.target.src = 'no-poster-available.jpg'} alt="Description" />
                        <div className="cards__overlay">
                            <div className="card__title">{movie ? movie.Series_Title : ""}</div>
                            <div className="card__runtime">
                                {movie ? movie.Released_Year : ""}
                                <span className="card__rating">{movie ? movie.IMDB_Rating : ""}<i className="fas fa-star" /></span>
                                <span className="card__rating"> | <i className="fas fa-star" /></span> {/* Add this line for separation */}
                                <span className="card__rating">{movie ? movie.Meta_score : ""}<i className="fas fa-star" /></span>
                            </div>
                            <div className="card__description">{movie ? movie.Overview.slice(0, 118) + "..." : ""}</div>
                        </div>
                    </div>
                </Link>

        }
    </>;
};

export default Cards;
