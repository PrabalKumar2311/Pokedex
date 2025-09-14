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

  // Region logic

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

  // Filter by type logic

const [type, setType] = useState("ALL");
const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

const types = [
  "ALL",
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy"
];

const handleTypeClick = (selectedType) => {
  setType(selectedType);
  setIsTypeDropdownOpen(false);
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

  const filteredData = pokemon.filter((curPokemon) => {
  const matchesSearch = curPokemon.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesType =
    type === "ALL" ||
    curPokemon.types.some(
      (t) => t.type.name.toLowerCase() === type.toLowerCase()
    );

  return matchesSearch && matchesType;
});


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

  if (error)
    return (
      <div className="no-results info-message">
        <p>{error.message}</p>
        <button
          onClick={() => {
            setError(null); // clear error
            setLoading(true); // show loader again

            const kanto = { name: "KANTO", value: 151 };

            setRegion(kanto);
            localStorage.setItem("selectedRegion", JSON.stringify(kanto));
          }}
        >
          Return to KANTO
        </button>
      </div>
    );

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
          {/* REGION */}
          <div
            className="region"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="arrow">
              <i className="fa-solid fa-sort-down"></i>
            </div>
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

          {/* TYPE */}
          <div
            className="types"
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
          >
            <div className="arrow">
              <i className="fa-solid fa-sort-down"></i>
            </div>
            <div className="selected-type">{type}</div>
            {isTypeDropdownOpen && (
              <div className="types-content types-grid">
                {types.map((t) => (
                  <p key={t} onClick={() => handleTypeClick(t)}>
                    {t.toUpperCase()}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          {filteredData.length === 0 ? (
  <p className="no-results">No Pokémon found.</p>
) : (
  <ul className="cards">
    {filteredData.map((curPokemon) => (
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
