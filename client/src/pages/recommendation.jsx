import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import Cards from "../components/card/card";
import { Link } from "react-router-dom";

const RecommendationComponent = () => {
    const [userWatchlist, setUserWatchlist] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [recommendedMovies, setRecommendedMovies] = useState([]);

    useEffect(() => {
        // Fetch user watchlist and all movies
        const fetchUserData = async () => {
            const userid = sessionStorage.getItem('userId');
            try {
                const userWatchlistResponse = await axios.get(`http://localhost:8800/watchlistres/${userid}`);
                const allMoviesResponse = await axios.get('http://localhost:8800/imdb');

                // Update state variables after successful responses
                setUserWatchlist(userWatchlistResponse.data);
                setAllMovies(allMoviesResponse.data);

            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        // Call the fetchUserData function
        fetchUserData();
    }, []); // Only run this effect once on component mount

    useEffect(() => {
        // Perform content-based recommendation when userWatchlist or allMovies change
        const contentBasedRecommendations = performContentBasedRecommendation(userWatchlist, allMovies);
        console.log("answer", contentBasedRecommendations);
        setRecommendedMovies(contentBasedRecommendations);
    }, [userWatchlist, allMovies]);

    // Function to perform content-based recommendation
    const performContentBasedRecommendation = (watchlist, movies) => {
        // Calculate movie genre frequencies in the watchlist
        const genreFrequencies = watchlist.reduce((acc, movie) => {
            // Check if the 'Genre' property exists before splitting
            if (movie.Genre) {
                // Split genres into an array
                const genres = movie.Genre.split(', ');
                // Increment the count for each genre
                genres.forEach((genre) => {
                    acc[genre] = (acc[genre] || 0) + 1;
                });
            }
            return acc;
        }, {});

        // Filter out movies that are already in the watchlist
        const moviesNotInWatchlist = movies.filter((movie) => !watchlist.some((watchlistMovie) => watchlistMovie.id === movie.id));

        const recommendedMovies = moviesNotInWatchlist
            .map((movie) => {
                // Check if the 'Genre' property exists and is not empty
                if (movie.Genre && movie.Genre.trim() !== "") {
                    const movieGenres = movie.Genre.split(',').map((genre) => genre.trim());
                    const commonGenres = movieGenres.filter((genre) => genreFrequencies[genre]);
                    const similarityScore = commonGenres.length;
                    return { ...movie, similarityScore };
                }
                return null; // Skip movies without valid genres
            })
            .filter((movie) => movie !== null) // Remove movies without valid genres
            .sort((a, b) => b.similarityScore - a.similarityScore)
            .slice(0, 12);

        return recommendedMovies;
    };
    return (
        <div>
            <h2 style={{ color: "white" }}>Your type of movies based on your Watchlist</h2>
            <ul>
                {recommendedMovies.map((movie) => (
                    <Cards key={movie.id} movie={movie} />
                ))}
            </ul>
        </div>
    );
};

export default RecommendationComponent;