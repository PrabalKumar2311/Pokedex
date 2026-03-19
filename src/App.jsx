import React, { useEffect, useState, useCallback } from "react";
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
  // Cache for all fetched regions: { [regionName]: pokemonArray }
  const [regionsData, setRegionsData] = useState({});
  // Current region's data (displayed in Pokemon component)
  const [currentRegionData, setCurrentRegionData] = useState([]);
  const [favourites, setFavourites] = useState(
    JSON.parse(localStorage.getItem("favourites")) || []
  );

  // Stable toggle function
  const toggleFavourite = useCallback((id) => {
    setFavourites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  }, []);

  // Sync favourites with localStorage
  useEffect(() => {
    localStorage.setItem("favourites", JSON.stringify(favourites));
  }, [favourites]);

  // Load favourites from storage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favourites")) || [];
    setFavourites(stored);
  }, []);

  // Function to fetch and cache a region
  const fetchRegion = useCallback(async (region) => {
    try {
      const limit = region.end - region.start + 1;
      const offset = region.start - 1;
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      const data = await res.json();

      const detailed = await Promise.all(
        data.results.map(async (p) => {
          const r = await fetch(p.url);
          return r.json();
        })
      );

      // Save to cache and set as current data
      setRegionsData((prev) => ({ ...prev, [region.name]: detailed }));
      setCurrentRegionData(detailed);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }, []);

  const location = useLocation();
  const background = location.state?.background;

  return (
    <>
      <Navbar />
      <Routes location={background || location}>
        <Route
          path="/"
          element={
            <Pokemon
              currentRegionData={currentRegionData}
              setCurrentRegionData={setCurrentRegionData}
              regionsData={regionsData}
              fetchRegion={fetchRegion}
              favourites={favourites}
              toggleFavourite={toggleFavourite}
            />
          }
        />
        <Route
          path="/favourites"
          element={
            <FavouritePokemons
              allPokemon={Object.values(regionsData).flat()}
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
            element={<PokemonDetailView isModal />}
          />
        </Routes>
      )}
    </>
  );
}