import React, { useEffect, useState } from "react";
import "./movie.css";
import axios from "axios";
import { useParams } from "react-router-dom";

const Movie = () => {
    const [selectedMovie, setSelectedMovie] = useState(null);
    const { movieId } = useParams();
    const [addingToWatchlist, setAddingToWatchlist] = useState(false);

    const [selectedRating, setSelectedRating] = useState(1); // State to track the selected rating
    const [reviews, setReviews] = useState([]);

    const handleRatingChange = (e) => {
        setSelectedRating(parseInt(e.target.value, 10));
    };

    console.log("movie id is", movieId);



    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8800/imdb");
                const movies = res.data;

                // Find the selected movie based on movieId
                const movie = movies.find((m) => m.id === parseInt(movieId));

                // Set the selected movie to the state
                setSelectedMovie(movie);
            } catch (err) {
                console.log(err);
            }
        };

        if (movieId) {
            fetchData();
        }
    }, [movieId]);

    useEffect(() => {
        // Function to fetch reviews for the current movie
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:8800/reviews/${movieId}`);
                console.log("RESPONSE", response.data);
                setReviews(response.data); // Assuming the response contains an array of reviews
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };
        // Fetch reviews when the selected movie changes
        if (selectedMovie) {
            fetchReviews();
        }
    }, [movieId, selectedMovie]);

    // If the movie is still loading or not found, show a loading message
    if (!selectedMovie) {
        return <div>Loading...</div>;
    }
    const getFMoviesLink = (title) => {
        const formattedTitle = title.toLowerCase().replace(/ /g, "-");
        return `https://fmovies.ps/search/${formattedTitle}`;
    };

    const addToWatchlist = () => {
        setAddingToWatchlist(true);
        const wid = sessionStorage.getItem('userId');
        console.log("userid", wid, "movieid", selectedMovie.id);
        axios.post('http://localhost:8800/watchlist', { userid: wid, movieid: selectedMovie.id })
            .then((response) => {
                console.log(response);
                if (response.data.success) {
                    // Handle success, show a success message or update UI
                    console.log('Movie added to watchlist successfully');
                } else {
                    // Handle failure, show an error message or update UI accordingly
                    console.error('Failed to add movie to watchlist');
                }
            })
            .catch((error) => {
                console.error('Error adding movie to watchlist:', error);
            });

        setTimeout(() => {
            setAddingToWatchlist(false);
        }, 1000);
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            const enteredText = e.target.value;
            const wid = sessionStorage.getItem('userId');

            axios.post('http://localhost:8800/enterreview', {
                movieid: selectedMovie.id,
                userid: wid,
                rating: selectedRating,
                review_text: enteredText
            })
                .then((response) => {
                    console.log(response);
                    window.location.reload();
                    if (response.status === 200 && response.data && response.data.success) {
                        // Handle success, show a success message or update UI
                        console.log('Review added successfully');
                    }
                })
                .catch((error) => {
                    console.error('Error adding review:', error);
                });
        }
    };

    return (
        <div>
            <div className="movies">
                <div className="movies2" key={selectedMovie.id}>
                    <div className="movie">
                        <div className="movie__intro">
                            <img className="movie__backdrop" src={selectedMovie.Poster_Link} alt="" />
                        </div>
                        <div className="movie__detail">
                            <div className="movie__detailLeft">
                                <div className="movie__posterBox">
                                    <img className="movie__poster" src={selectedMovie.Poster_Link} alt="" />
                                </div>
                            </div>
                            <div className="movie__detailRight">
                                <div className="movie__detailRightTop">
                                    <div className="movie__name">{selectedMovie.Series_Title}</div>
                                    <div className="movie__tagline">{selectedMovie.Director}</div>
                                    <div className="movie__rating">
                                        Rating: {selectedMovie.IMDB_Rating} <i className="fas fa-star" />
                                        Metacritic Score: {selectedMovie.Meta_score} <i className="fas fa-star" />
                                        <span className="movie__voteCount">Votes: {selectedMovie.No_of_Votes}</span>
                                    </div>
                                    <div className="movie__runtime">{selectedMovie.Runtime}</div>
                                    <div className="movie__releaseDate">{selectedMovie.Released_Year}</div>
                                    <div className="movie__genres">
                                        {selectedMovie.Genre}
                                    </div>
                                </div>
                                <div className="movie__detailRightBottom">
                                    <div className="synopsisText">Synopsis</div>
                                    <div>{selectedMovie.Overview}</div>
                                </div>
                            </div>
                        </div>
                        <div className="movie__links">
                            <div className="movie__heading" style={{ color: "white" }}>Useful Links</div>
                            <a href={getFMoviesLink(selectedMovie.Series_Title)} target="_blank" style={{ textDecoration: "none" }} rel="noopener noreferrer">
                                <p>
                                    <span className="movie__homeButton movie__Button">Fmovies<i className="newTab fas fa-external-link-alt"></i></span>
                                </p>
                            </a>

                            {/* Add to Watchlist button */}
                            <button
                                className="movie__homeButton movie__Button"
                                id="test2"
                                onClick={addToWatchlist}
                            >
                                {addingToWatchlist ? 'Added to Watchlist' : 'Add to Watchlist'}
                            </button>                        </div>
                        <div className="reviews">
                            <h2 style={{ color: "white" }}>Reviews</h2>
                            <ul>
                                {reviews.map((review) => (
                                    <li key={review.review_id} style={{ color: "white" }}>
                                        <div>User: {review.username}</div>
                                        <div>Rating: {review.rating}</div>
                                        <div>Thoughts: {review.review_text}</div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="inputBox" id="box">
                            <input type="text" onKeyDown={(e) => handleKeyDown(e)} />
                            <i>Write a review! (Enter to post)</i>
                            <select value={selectedRating} onChange={handleRatingChange} style={{ color: 'black', fontWeight: 'bold', marginLeft: '95%' }}>
                                {Array.from({ length: 10 }, (_, index) => index + 1).map((rating) => (
                                    <option key={rating} value={rating}>
                                        {rating}
                                    </option>
                                ))}
                            </select>
                            <i>Rating</i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        // </div >
    );
};

export default Movie;
