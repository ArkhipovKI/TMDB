import "./app.css";
import React, { useState, useEffect } from "react";
import MoviesList from "../moviesList/MoviesList";
import "bootstrap/dist/css/bootstrap.min.css";
import Search from "../header/Search";
import { Pagination } from "antd";
import "antd/dist/antd.css";
import { Tabs, Alert, Spin } from "antd";
import lodash from "lodash";

const { TabPane } = Tabs;

const SEARCH_API =
  "https://api.themoviedb.org/3/search/movie?api_key=f8773dd7a15349b5bd291aff0bdb3025&query=";
const apiKey = "api_key=f8773dd7a15349b5bd291aff0bdb3025";
const apiBase = "https://api.themoviedb.org/3/";
const GUEST_SESSION_API =
  "https://api.themoviedb.org/3/authentication/guest_session/new?api_key=f8773dd7a15349b5bd291aff0bdb3025";

const App = () => {
  const [ratedMoviesMap, setRatedMoviesMap] = useState({});
  const [moviesMap, setMoviesMap] = useState({}); // {1: {id: 1, ...} }
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [pages, setPages] = useState("");
  const [guestSessionId, setGuestSessionId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [genres, setGenres] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const setTakenMovies = (movies) => {
    setMoviesMap(
      movies.reduce((map, movie) => ({ ...map, [movie.id]: movie }), {})
    );
  };

  const getGenres = async () => {
    const responseGenres = await fetch(`${apiBase}genre/movie/list?${apiKey}`);
    const responseGenresJSON = await responseGenres.json();
    const genres = responseGenresJSON.genres;
    setGenres(genres);
  };

  const getSessionId = async () => {
    const responseSession = await fetch(GUEST_SESSION_API);

    if (!responseSession.ok) {
      throw new Error(`Ошибка ${responseSession.status}`);
    }

    const responseSessionJSON = responseSession.json();

    setGuestSessionId(
      await responseSessionJSON.then(({ guest_session_id }) => guest_session_id)
    );
  };

  const handleRateMovie = async (movieId, rate) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/rating?${apiKey}&guest_session_id=${guestSessionId}`;

    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: rate }),
    });

    await setMoviesMap({
      ...moviesMap,
      [movieId]: { ...moviesMap[movieId], rate },
    });
  };
  const onError = () => {
    return (
      <Alert
        message="No movies found"
        description="Try again"
        type="info"
        showIcon
      />
    );
  };
  const getSearchedMovies = async (searchValue, page) => {
    if (!searchValue) {
      setIsSearching(false);
      return;
    }
    setIsLoading(true);
    setIsSearching(true);
    const responseSearch = await fetch(
      SEARCH_API + searchValue + "&page=" + page
    ).then((response) => response.json());
    setTakenMovies(responseSearch.results);
    setPage(responseSearch.page);
    setPages(responseSearch.total_pages);
    setIsLoading(false);
  };

  const getResultRatedMovies = async () => {
    const responseGET = await fetch(
      `${apiBase}guest_session/${guestSessionId}/rated/movies?${apiKey}`
    );
    const responseJSON = await responseGET.json();
    console.log(responseJSON);
    const result = await responseJSON.results;
    const pages = await responseJSON.total_pages;
    setRatedMoviesMap(result);
    setPages(pages);
  };

  const handleTabClick = (key) => {
    if (key === "2") getResultRatedMovies();
  };

  useEffect(() => {
    getSessionId();
    getGenres();
  }, []);

  useEffect(() => {
    const getMovieRequest = async (page) => {
      if (isSearching === true) return;
      setIsLoading(true);
      const responseJson = await fetch(
        `${apiBase}movie/popular?${apiKey}&page=${page}`
      ).then((response) => response.json());
      setTakenMovies(responseJson.results);
      setPages(responseJson.total_pages);
      setIsSearching(false);
      setIsLoading(false);
    };
    getMovieRequest(page);
  }, [page]);

  useEffect(() => {
    const getResult = lodash.debounce(() => {
      getSearchedMovies(searchValue, page);
    }, 700);
    getResult();
  }, [searchValue, page]);

  return (
    <div className="movie-app">
      <Tabs defaultActiveKey="1" centered onTabClick={handleTabClick}>
        <TabPane tab="search" key="1">
          <div className="search_panel">
            <Search
              placeholder="type for search movies"
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              setIsLoading={setIsLoading}
            />
          </div>
          {isLoading ? (
            <div className="spinner-wrapper">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <div className="movies__list">
                {Object.values(moviesMap).length ? (
                  <MoviesList
                    movies={Object.values(moviesMap)}
                    handleRateMovie={handleRateMovie}
                    guestSessionId={guestSessionId}
                    genres={genres}
                  />
                ) : (
                  onError()
                )}
              </div>
              <div className="btns">
                <nav
                  aria-label="Page navigation example"
                  className="pagination-wrapper"
                >
                  <Pagination
                    current={page}
                    defaultPageSize={1}
                    total={pages}
                    onChange={setPage}
                    showSizeChanger={false}
                    size="default"
                  />
                </nav>
              </div>
            </>
          )}
        </TabPane>
        <TabPane tab="rated" key="2">
          <div className="row movies__list">
            {ratedMoviesMap.length ? (
              <MoviesList
                movies={ratedMoviesMap}
                guestSessionId={guestSessionId}
                genres={genres}
              />
            ) : (
              onError()
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};
export default App;
