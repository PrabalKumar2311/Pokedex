import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Pokemon from "./Pokemon.jsx";
import FavouritePokemons from "./FavouritePokemons.jsx";

export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  // Toggle favourite Pokemon
  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id)
        ? prev.filter((favId) => favId !== id)
        : [...prev, id]
    );
  };

  // Load favourites from localStorage on mount
  useEffect(() => {
    const storedFavourites =
      JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(storedFavourites);
  }, []);

  // Save favourites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  return (
    <Router>
      <Navbar />
      <div
        style={{
          transform: "scale(0.8)",
          transformOrigin: "top left",
          width: "125%", // fix
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              <Pokemon
                pokemon={pokemon}
                setPokemon={setPokemon}
                favourites={favourites}
                toggleFavourite={toggleFavourite}
              />
            }
          />
          <Route
            path="/favourites"
            element={
              <FavouritePokemons
                pokemon={pokemon}
                favourites={favourites}
                toggleFavourite={toggleFavourite}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
