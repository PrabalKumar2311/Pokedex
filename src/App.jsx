// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, useLocation, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Pokemon from "./Pokemon";
import FavouritePokemons from "./FavouritePokemons";
import PokemonDetailView from "./PokemonDetailView";

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [pokemon, setPokemon] = useState([]);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  const toggleFavourite = (id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(storedFavourites);
  }, []);

  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <>
      <Navbar />

      <Routes location={background || location}>
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

        <Route path="/pokemon/:id" element={<PokemonDetailView />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path="/pokemon/:id"
            element={<PokemonDetailView isModal={true} />}
          />
        </Routes>
      )}
    </>
  );
}
