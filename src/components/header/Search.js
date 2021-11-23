import React from "react";

const Search = ({ searchValue, setSearchValue, setIsLoading }) => {
  return (
    <>
      <input
        className="form-control"
        onChange={(event) => setSearchValue(event.target.value)}
        placeholder="Type to search..."
      />
    </>
  );
};

export default Search;
