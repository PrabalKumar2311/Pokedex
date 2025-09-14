import { useState, useEffect, useRef } from "react";
import PokemonCard from "./PokemonCard.jsx";

export default function Pokemon({
  pokemon,
  setPokemon,
  favourites,
  toggleFavourite,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(
    JSON.parse(localStorage.getItem("selectedRegion")) || {
      name: "KANTO",
      value: 151,
    }
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const API = `https://pokeapi.co/api/v2/pokemon?limit=${region?.value ?? 151}`;

  const regions = [
    { name: "KANTO", value: 151 },
    { name: "JOHTO", value: 251 },
    { name: "HOENN", value: 386 },
    { name: "SINNOH", value: 493 },
    { name: "UNOVA", value: 649 },
    { name: "KALOS", value: 721 },
    { name: "ALOLA", value: 807 },
    { name: "GALAR", value: 898 },
  ];

  const handleClick = (item) => {
    setRegion(item);
    setIsDropdownOpen(false);
    localStorage.setItem("selectedRegion", JSON.stringify(item));
  };

  const fetchPokemon = async () => {
    try {
      console.log("API");
      const res = await fetch(API);
      const data = await res.json();

      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        return await res.json();
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
    console.log(region);
  }, [region]);

  const searchData = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  // if (loading) return <p className="no-results info-message">Loading...</p>;

  if (loading)
    return (
      <div className="loading">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <p>Loading Pokémons...</p>
      </div>
    );

  if (error) return <p className="no-results info-message">{error.message}</p>;

  return (
    <>
      <section className="container">
        <header>
          <h1>Welcome To Pokedex</h1>
        </header>

        <div className="pokemon-search">
          <input
            type="text"
            placeholder="Search Pokemon"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div
            className="region"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="selected-region">{region.name}</div>
            {isDropdownOpen && (
              <div className="region-content">
                {regions.map((item) => (
                  <p key={item.name} onClick={() => handleClick(item)}>
                    {item.name}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {searchData.length === 0 ? (
            <p className="no-results">No Pokémon found.</p>
          ) : (
            <ul className="cards">
              {searchData.map((curPokemon) => (
                <PokemonCard
                  key={curPokemon.id}
                  pokemonData={curPokemon}
                  isFavourite={favourites.includes(curPokemon.id)}
                  onFavouriteToggle={toggleFavourite}
                />
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}
