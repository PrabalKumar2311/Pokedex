import { useState, useEffect } from "react";
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

  // Region state (persisted in localStorage)
  const [region, setRegion] = useState(
    JSON.parse(localStorage.getItem("selectedRegion")) || {
      name: "KANTO",
      start: 1,
      end: 151,
    }
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Available regions (start & end ranges)
  const regions = [
    { name: "KANTO", start: 1, end: 151 },
    { name: "JOHTO", start: 152, end: 251 },
    { name: "HOENN", start: 252, end: 386 },
    { name: "SINNOH", start: 387, end: 493 },
    { name: "UNOVA", start: 494, end: 649 },
    { name: "KALOS", start: 650, end: 721 },
    { name: "ALOLA", start: 722, end: 807 },
    { name: "GALAR", start: 808, end: 898 },
    { name: "ALL", start: 1, end: 898 },
  ];

  const handleClick = (item) => {
    setRegion(item);
    setIsDropdownOpen(false);
    localStorage.setItem("selectedRegion", JSON.stringify(item));
  };

  // Type filter state (persisted in localStorage)
  const [type, setType] = useState(
    JSON.parse(localStorage.getItem("selectedType")) || {
      name: "All Types",
      logo: "",
    }
  );
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Types
  const types = [
    { name: "All Types", logo: "" },
    { name: "Normal", logo: "/PokemonLogos/Normal.png" },
    { name: "Fire", logo: "/PokemonLogos/Fire.png" },
    { name: "Water", logo: "/PokemonLogos/Water.png" },
    { name: "Grass", logo: "/PokemonLogos/Grass.png" },
    { name: "Electric", logo: "/PokemonLogos/Electric.png" },
    { name: "Ice", logo: "/PokemonLogos/Ice.png" },
    { name: "Fighting", logo: "/PokemonLogos/Fighting.png" },
    { name: "Poison", logo: "/PokemonLogos/Poison.png" },
    { name: "Ground", logo: "/PokemonLogos/Ground.png" },
    { name: "Flying", logo: "/PokemonLogos/Flying.png" },
    { name: "Psychic", logo: "/PokemonLogos/Psychic.png" },
    { name: "Bug", logo: "/PokemonLogos/Bug.png" },
    { name: "Rock", logo: "/PokemonLogos/Rock.png" },
    { name: "Ghost", logo: "/PokemonLogos/Ghost.png" },
    { name: "Dragon", logo: "/PokemonLogos/Dragon.png" },
    { name: "Dark", logo: "/PokemonLogos/Dark.png" },
    { name: "Steel", logo: "/PokemonLogos/Steel.png" },
    { name: "Fairy", logo: "/PokemonLogos/Fairy.png" },
  ];

  const handleTypeClick = (selectedType) => {
    setType(selectedType);
    setIsTypeDropdownOpen(false);
    localStorage.setItem("selectedType", JSON.stringify(selectedType));
  };

  // Fetch Pokémon data for selected region
  const fetchPokemon = async () => {
    try {
      setLoading(true);
      setError(null);

      const limit = region.end - region.start + 1;
      const offset = region.start - 1;

      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
      );
      const data = await res.json();
      console.log(data)

      const detailedPokemonData = data.results.map(async (curPokemon) => {
        const res = await fetch(curPokemon.url);
        return await res.json();
      });

      const detailedResponses = await Promise.all(detailedPokemonData);
      setPokemon(detailedResponses);
      setLoading(false);

      console.log(detailedPokemonData)

    } catch (error) {
      console.error(error);
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [region]);

  // Filtering logic
  const filteredData = pokemon.filter((curPokemon) => {
    const searchLower = search.toLowerCase();

    // Match by name or ID
    const matchesSearch =
      curPokemon.name.toLowerCase().includes(searchLower) ||
      curPokemon.id.toString().includes(searchLower);

    // Match by type
    const matchesType =
      type.name === "All Types" ||
      curPokemon.types.some(
        (t) => t.type.name.toLowerCase() === type.name.toLowerCase()
      );

    return matchesSearch && matchesType;
  });

  // Loading state
  if (loading)
    return (
      <div className="loading">
        <div className="progress-bar">
          <div className="progress"></div>
        </div>
        <p>Loading Pokémons...</p>
      </div>
    );

  // Error state
  if (error)
    return (
      <div className="no-results info-message">
        <p>{error.message}</p>
        <button
          className="error-screen-btn"
          onClick={() => {
            setError(null);
            setRegion({ name: "KANTO", start: 1, end: 151 });
            localStorage.setItem(
              "selectedRegion",
              JSON.stringify({ name: "KANTO", start: 1, end: 151 })
            );
          }}
        >
          Return to Kanto
        </button>
      </div>
    );

//     const input = document.querySelector('input[type="text"]');
//     const typeText = document.querySelector('.type-text');

// function updatePlaceholder() {
//   if (!input || !typeText) return;
//   if (window.innerWidth < 410) {
//     input.placeholder = "Search";
//     typeText.innerHTML = "All"
//   } else {
//     input.placeholder = "Search Pokemon";
    
//   }
// }

// updatePlaceholder();

// window.addEventListener("resize", updatePlaceholder);

  // Main UI
  return (
    <section className="container">
      <header>
        <h1>Welcome To Pokedex</h1>
      </header>

      <div className="pokemon-search">
        {/* Search */}
        <input
          type="text"
          placeholder="Search Pokemon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* REGION Dropdown */}
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

        {/* TYPE Dropdown */}
        <div
          className="types"
          onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
        >
          <div className="arrow-type">
            <i className="fa-solid fa-sort-down"></i>
          </div>
          <div className="selected-type">
            {type.logo && (
              <img src={type.logo} alt={type.name} className="type-logo" />
            )}
            <span className="type-text">{type.name}</span>
          </div>

          {isTypeDropdownOpen && (
            <div className="types-content types-grid">
              {types.map((t) => (
                <div
                  key={t.name}
                  className="type-option"
                  onClick={() => handleTypeClick(t)}
                >
                  {t.logo && (
                    <div className="type-logo-wrapper">
                      <img src={t.logo} alt={t.name} className="type-logo" />
                    </div>
                  )}
                  <p>{t.name.toUpperCase()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pokémon Cards */}
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

      <div className="bottom-logo-container">
        <img className="bottom-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        src="../public/title-img.png"/>
      </div>
    </section>
  );
}