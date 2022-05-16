import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { URL } from "../constants/constants";

export default function AutoSuggest() {
  const [suggestions, setSuggestions] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();
  const autCompleteRef = useRef();

  const handleClickOutside = (e) => {
    if (autCompleteRef.current.contains(e.target)) {
      return;
    }
    setIsFocused(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    inputRef.current.focus();
    setSelectedSuggestionIndex(-1);
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
        if (res.data.length > 0) {
          setSelectedSuggestionIndex(0);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleKeyDown = (e) => {
    // up arrow
    if (e.keyCode === 38) {
      setSelectedSuggestionIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1
      );
    }

    // down arrow
    if (e.keyCode === 40) {
      setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
    }

    // enter
    if (e.keyCode === 13) {
      setSearchTerm(suggestions[selectedSuggestionIndex].name);
    }

    // esc
    if (e.keyCode === 27) {
      setIsFocused(false);
      inputRef.current.blur();
    }
  };

  return (
    <div ref={autCompleteRef}>
      <label htmlFor="name">Name</label>
      <input
        name="name"
        id="name"
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsFocused(true);
        }}
        ref={inputRef}
        autoComplete="off"
      />
      <div>
        {isFocused &&
          suggestions &&
          suggestions.length > 0 &&
          suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              onMouseEnter={() => {
                setSelectedSuggestionIndex(index);
              }}
              onClick={() => {
                setSearchTerm(suggestion.name);
              }}
              style={{
                backgroundColor:
                  index === selectedSuggestionIndex
                    ? "hsl(120, 50%, 80%)"
                    : "transparent",
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
