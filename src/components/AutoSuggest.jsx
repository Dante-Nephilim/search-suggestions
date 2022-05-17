import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import { URL } from "../constants/constants";
import { debounce } from "../utils/debounce";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

export default function AutoSuggest() {
  const [suggestions, setSuggestions] = useState();
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef();
  const autCompleteRef = useRef();
  const history = useHistory();

  const handleClickOutside = (e) => {
    if (autCompleteRef.current?.contains(e.target)) {
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
    setError(undefined);
    if (searchTerm.length > 0) {
      fetchUserList();
    } else {
      setSuggestions(undefined);
    }
  }, [searchTerm]);

  const handleChange = useCallback(
    debounce((input) => {
      setSearchTerm(input);
    }, 400),
    []
  );

  const fetchUserList = () => {
    setIsLoading(true);
    axios
      .get(`${URL}/users?name_like=${searchTerm}`)
      .then((res) => {
        setSuggestions(res.data);
        if (res.data.length > 0) {
          setSelectedSuggestionIndex(0);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
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
      history.push(`/users/${suggestions[selectedSuggestionIndex].id}`);
    }

    // esc
    if (e.keyCode === 27) {
      setIsFocused(false);
      inputRef.current.blur();
    }
  };

  return (
    <div
      ref={autCompleteRef}
      className="mt-32 flex flex-col items-stretch mx-auto max-w-md "
    >
      <TextField
        label="User Search"
        variant="outlined"
        name="name"
        id="name"
        type="text"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        }}
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          handleChange(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setIsFocused(true);
        }}
        inputRef={inputRef}
        autoComplete="off"
      />
      <div className=" pt-3">
        {isFocused &&
          suggestions &&
          suggestions.length > 0 &&
          suggestions.map((suggestion, index) => (
            <div
              className={`p-2 ${
                index === selectedSuggestionIndex ? "bg-gray-200" : ""
              } transition-colors`}
              key={suggestion.id}
              onMouseEnter={() => {
                setSelectedSuggestionIndex(index);
              }}
              onClick={() => {
                history.push(
                  `/users/${suggestions[selectedSuggestionIndex].id}`
                );
              }}
            >
              {suggestion.name}
            </div>
          ))}
        {isLoading && <div>Loading...</div>}
        {suggestions && suggestions.length === 0 && <div>No results found</div>}
        {error && <div>{error}</div>}
      </div>
    </div>
  );
}
