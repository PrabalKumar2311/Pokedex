import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Pokemon from "./Pokemon.jsx";
import FavouritePokemons from "./FavouritePokemons.jsx";


export default function App() {
  const [pokemon, setPokemon] = useState([]);
  const [favourites, setFavourites] = useState(JSON.parse(localStorage.getItem("favourites")) || []);

const toggleFavourite = (pokemonData) => {
  setFavourites((prev) => {
    const exists = prev.find((p) => p.id === pokemonData.id);
    if (exists) {
      return prev.filter((p) => p.id !== pokemonData.id);
    } else {
      return [...prev, pokemonData];
    }
  });
};



  useEffect(()=>{
    const storedFavourites = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(storedFavourites);
  },[])

  useEffect(()=>{
    localStorage.setItem('favourites', JSON.stringify(favourites));
  },[favourites]);

  return (
    <Router>
      <Navbar />

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
    </Router>
  );
}
