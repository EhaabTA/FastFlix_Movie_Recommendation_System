import { BrowserRouter, Routes, Route } from "react-router-dom";
import All from "./pages/all";
import Add from "./pages/add";
import Delete from "./pages/delete";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from './pages/home/home';
import MovieList from './components/movieList/movieList';
import Movie from './pages/movieDetail/movie';
import Header from './components/header/Header';
import Login from "./pages/login";
import Register from "./pages/register";
import Recommendation from "./pages/recommendation";
import Watchlist from "./pages/watchlist";




function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Home />}></Route>
          <Route exact path="movie/:movieId" element={<Movie />}></Route>
          <Route exact path="watchlistres/:userid" element={<Watchlist />}></Route>
          <Route path="movies/:type" element={<MovieList />}></Route>
          <Route path="/add" element={<Add />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/all" element={<All />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recommend" element={<Recommendation />} />
          <Route path="/*" element={<h1>Error Page</h1>}></Route>
          {/* <Route path="movies/:movieId" exact component={<MovieList />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
