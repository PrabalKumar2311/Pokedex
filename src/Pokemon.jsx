import { useState, useEffect, useMemo, useCallback } from "react";
import PokemonCard from "./PokemonCard";

export default function Pokemon({
  currentRegionData,
  setCurrentRegionData,
  regionsData,
  fetchRegion,
  favourites,
  toggleFavourite,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState(
    JSON.parse(localStorage.getItem("selectedRegion")) || {
      name: "KANTO",
      start: 1,
      end: 151,
    }
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [type, setType] = useState(
    JSON.parse(localStorage.getItem("selectedType")) || {
      name: "All Types",
      logo: "",
    }
  );
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  // Available regions
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

  // Available types
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

  // Handlers
  const handleRegionClick = useCallback((item) => {
    setRegion(item);
    setIsDropdownOpen(false);
    localStorage.setItem("selectedRegion", JSON.stringify(item));
  }, []);

  const handleTypeClick = useCallback((selectedType) => {
    setType(selectedType);
    setIsTypeDropdownOpen(false);
    localStorage.setItem("selectedType", JSON.stringify(selectedType));
  }, []);

  // Load region data (cached or fetch)
  useEffect(() => {
    const loadRegion = async () => {
      if (regionsData[region.name]) {
        setCurrentRegionData(regionsData[region.name]);
        setLoading(false);
        setError(null);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        await fetchRegion(region);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    loadRegion();
  }, [region, regionsData, fetchRegion, setCurrentRegionData]);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return currentRegionData.filter((curPokemon) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        curPokemon.name.toLowerCase().includes(searchLower) ||
        curPokemon.id.toString().includes(searchLower);

      const matchesType =
        type.name === "All Types" ||
        curPokemon.types.some(
          (t) => t.type.name.toLowerCase() === type.name.toLowerCase()
        );

      return matchesSearch && matchesType;
    });
  }, [currentRegionData, search, type]);

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

  // Main UI
  return (
    <section className="container">
      <header>
        <h1>Welcome To Pokedex</h1>
      </header>

      <div className="pokemon-search">
        {/* Search input */}
        <input
          type="text"
          placeholder="Search Pokemon"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Region dropdown */}
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
                <p key={item.name} onClick={() => handleRegionClick(item)}>
                  {item.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Type dropdown */}
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

      {/* Cards */}
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
        <img
          className="bottom-logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          src="../public/title-img.png"
          alt="Scroll to top"
        />
      </div>
    </section>
  );
}