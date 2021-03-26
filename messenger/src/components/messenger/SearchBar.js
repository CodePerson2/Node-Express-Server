import { useState } from "react";
import SearchResults from "./SearchResults";

const SearchBar = ({ userInfo, darkMode, returnSearch, makeGroup, searchResults }) => {
  const [searchVal, setSearchVal] = useState("");
  

  const onInput = (e) => {
    setSearchVal(e.target.value);
    returnSearch(e.target.value);
  };

  const addUser = (id) => {
    makeGroup(id)
  };

  return (
    <div>
      <div className="App-SideBar-Search">
        <input
          autoComplete="off"
          className={`${darkMode ? "input-D" : "input-L"}`}
          onChange={(e) => onInput(e)}
          value={searchVal}
          type="text"
          name="search"
          id="search"
          placeholder="Search For Friends..."
          maxLength="255"
        />
      </div>

      <div className="App-SideBar-SearchRes">
        {searchResults !== null && searchResults.length > 0
          ? searchResults.map((res) => (
              <SearchResults
                name={res.userName}
                userID={res.userID}
                addUser={addUser}
                darkMode={darkMode}
              />
            ))
          : ""}
      </div>
    </div>
  );
};

export default SearchBar;
