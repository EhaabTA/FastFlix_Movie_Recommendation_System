import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();

const db = mysql.createConnection({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: '',
    database: "ff",
});
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json("hello from the backend");
});

app.listen(8800, () => {
    console.log("connected to backend");
});

app.get("/imdb", (req, res) => {
    const q = "select * from imdb_top_1000 order by Series_Title asc";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});


app.get("/popular", (req, res) => {
    const q = "select * from imdb_top_1000 where IMDB_Rating > 8.5 order by IMDB_Rating";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);

        }
        return res.json(data);
    });
});

app.post("/register", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    db.query("INSERT INTO users (username,password) values (?,?)", [username, password], (err, result) => {
        if (err) { console.log(err); }
    });
});

app.post("/watchlist", (req, res) => {
    const userid = req.body.userid;
    const movieid = req.body.movieid;
    db.query("INSERT INTO watchlist (user_id,movie_id) values (?,?)", [userid, movieid], (err, result) => {
        if (err) { console.log(err); }
    });
});

app.get("/watchlistres/:userid", (req, res) => {
    const userid = req.params.userid;
    const q = "SELECT imdb_top_1000.* FROM imdb_top_1000 JOIN watchlist ON imdb_top_1000.id = watchlist.movie_id WHERE watchlist.user_id = ?";
    db.query(q, [userid], (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});


app.post("/login", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    db.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password], (err, result) => {
        if (err) {
            res.send({ err: err });
        }

        if (result.length > 0) {
            res.send(result);
        }
        else {
            res.send({ message: "Incorrect authentication details" });
        }
    });
});

app.post("/deleteAccount", (req, res) => {
    const userId = req.body.userId;
    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Assuming you have a users table with id as the primary key
    const deleteQuery = "DELETE FROM users WHERE id = ?";

    db.query(deleteQuery, [userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }


    });
});
app.post("/recresult", (req, res) => {
    const MovieName = req.body.MovieName;

    // First query
    db.query("SELECT * FROM imdb_top_1000 WHERE Series_Title = ?", [MovieName], (err, result) => {
        if (err) {
            res.send({ err: err });
        }

        if (result.length > 0) {
            // If results are found in the first query, send the results
            res.send(result);
        } else {
            // If no results are found in the first query, execute the second query
            db.query("SELECT * FROM ff.imdb_top_1000 WHERE Series_Title LIKE ?", [`%${MovieName}%`], (err, result) => {
                if (err) {
                    res.send({ err: err });
                }
                if (result.length > 0) {
                    // If results are found in the second query, send the results
                    res.send(result);
                } else {
                    // If no results are found in both queries, send a message
                    res.send({ message: "no result" });
                }
            });
        }
    });
});


app.post("/enterreview", (req, res) => {
    const userid = req.body.userid;
    const movieid = req.body.movieid;
    const rating = req.body.rating;
    const review_text = req.body.review_text;

    db.query("INSERT INTO reviews (movie_id,user_id, rating, review_text) VALUES (?, ?, ?, ?)", [movieid, userid, rating, review_text], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        res.status(200).json({ message: "Review added successfully" });
    });
});

app.get('/reviews/:movieId', (req, res) => {
    const movieId = req.params.movieId;

    // SQL query to select reviews for a specific movie ID
    const sqlQuery = 'SELECT  u.username, r.rating, r.review_text FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.movie_id = ?';
    db.query(sqlQuery, [movieId], (error, results) => {
        if (error) {
            console.error('Error fetching reviews:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json(results);
        }
    });

});

app.post("/imdb", (req, res) => {
    const q = "INSERT INTO imdb_top_1000(`poster_link`, `series_title`, `released_year`, `certificate`,`runtime`,`genre`,`imdb_rating`,`overview`,`meta_score`,`director`,`star1`,`star2`,`star3`,`star4`,`no_of_votes`,`gross`) VALUES (?)";
    const values = [
        req.body.poster_link,
        req.body.series_title,
        req.body.released_year,
        req.body.certificate,
        req.body.runtime,
        req.body.genre,
        req.body.imdb_rating,
        req.body.overview,
        req.body.meta_score,
        req.body.director,
        req.body.star1,
        req.body.star2,
        req.body.star3,
        req.body.star4,
        req.body.no_of_votes,
        req.body.gross,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.send(err);
        return res.json(data);
    });
});

