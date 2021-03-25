
const SearchResults = ({name, userID, addUser, darkMode}) => {
    return (
        <div className={`App-SideBar-SearchRes-val ${darkMode ? "input-D" : "input-L"}`}>
            <div>{name}</div>
            <button onClick={() => (addUser(userID))}>Add</button>
            
        </div>
    )
}

export default SearchResults
