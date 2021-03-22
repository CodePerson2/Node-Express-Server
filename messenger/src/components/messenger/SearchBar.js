import { useState } from "react";

const SearchBar = ({ darkMode, onSearch }) => {
  const [searchVal, setSearchVal] = useState("");

  const onInput = (e) => {
    setSearchVal(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <div className="App-SideBar-Search">
      <input
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
  );
};

export default SearchBar;
