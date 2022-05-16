import axios from "axios";
import { useEffect, useState } from "react";
import { URL } from "../constants/constants";

export default function AutoSuggest() {
  const [suggestions, setSuggestions] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setSuggestions(undefined);
    setIsError(false);
    if (searchTerm.length > 0) {
      fetchUserList();
    } else {
      setSuggestions(undefined);
    }
  }, [searchTerm]);

  const fetchUserList = () => {
    setIsLoading(true);
    axios
      .get(`${URL}/users?name_like=${searchTerm}`)
      .then((res) => {
        setSuggestions(res.data);
        setIsError(false);
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      <label htmlFor="name">Name</label>
      <input
        name="name"
        id="name"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        autoComplete="off"
      />
      <div>
        {suggestions &&
          suggestions.length > 0 &&
          suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              onClick={() => {
                setSearchTerm(suggestion.name);
              }}
            >
              {suggestion.name}
            </div>
          ))}
        {isLoading && <div>Loading...</div>}
        {suggestions && suggestions.length === 0 && <div>No results found</div>}
        {isError && <div>Error</div>}
      </div>
    </div>
  );
}
