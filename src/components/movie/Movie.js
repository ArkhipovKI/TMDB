// import React, { Component } from "react";
// import "./movie.css";
// import { Rate } from "antd";
// import { format } from "date-fns";
// import MovieService from "../../services/movieService";
// import "antd/dist/antd.css";

// const IMG_API = "https://image.tmdb.org/t/p/w500";

// export default class Movie extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       value: 0,
//     };

//     this.movieService = new MovieService();
//   }

//   handleChangeRate = (value) => {
//     this.setState({ value });
//     const { id, ratedMovies } = this.props;
//     const newObj = { ...ratedMovies, id: id, rateValue: value };
//     console.log({ ...ratedMovies, newObj });
//     return { ratedMovies };
//   };

//   render() {
//     const { title, rating, valueStar, poster_path, overview, date } =
//       this.props;
//     const { value } = this.state;
//     return (

//     );
//   }
// }
