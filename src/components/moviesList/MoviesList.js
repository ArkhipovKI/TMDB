import { React } from "react";
import "./moviesList.css";
import { Rate } from "antd";
import { format } from "date-fns";
import poster from "./img/poster_not_found.png";

const IMG_API = "https://image.tmdb.org/t/p/w500";

const MoviesList = ({ movies, handleRateMovie, genres }) => {
  const arr = movies.map((movie) => {
    return genres.reduce((acc, { id, name }) => {
      if (movie.genre_ids.includes(id)) {
        acc.push(name);
      }
      return acc;
    }, []);
  });

  const genreList = arr.map((item) => {
    return item.map((genre) => {
      return (
        <span key={Math.random() * 10000} className="movie-genre">
          {genre}
        </span>
      );
    });
  });

  const valueRate = (rate) => {
    let rateColor = "movies__rate";
    // eslint-disable-next-line no-unused-expressions
    rate <= 3 ? (rateColor += " movies__rate--from-zero-to-three") : "";
    // eslint-disable-next-line no-unused-expressions
    rate > 3 && rate <= 5
      ? (rateColor += " movies__rate--from-three-to-five")
      : "";
    // eslint-disable-next-line no-unused-expressions
    rate > 7 ? (rateColor += " movies__rate--more-than-seven") : "";
    return rateColor;
  };

  const rate = movies.map((item) => item.vote_average);

  return (
    <>
      {movies.map((movie, index) => (
        <>
          <li key={movie.id} className="movies__item ">
            <img
              className="movies__img"
              src={movie.poster_path ? IMG_API + movie.poster_path : poster}
              alt="poster"
            />
            <div className="movies__info">
              <h2 className="movies__title">{movie.title}</h2>
              <span className={valueRate(rate[index])}>{rate[index]}</span>
              <span className="movies__date">
                {format(new Date(movie.release_date), "MMMM dd, yyyy")}
              </span>
              <ul className="movies__genres">{genreList[index]}</ul>
              <span className="movies__date">{movie.date}</span>
              <p className="movies__description">{movie.overview}</p>
              <Rate
                allowHalf
                count={10}
                value={movie.rating || movie.rate}
                onChange={(value) => {
                  handleRateMovie(movie.id, value);
                }}
              />
            </div>
          </li>
        </>
      ))}
    </>
  );
};

export default MoviesList;
