import { useState, useEffect, useRef} from "react";
import PokemonCard from "./PokemonCard.jsx"

export default function Pokemon({ pokemon, setPokemon, favourites, toggleFavourite }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const hasFetched = useRef(false);

  const API = "https://pokeapi.co/api/v2/pokemon?limit=5";

  const fetchPokemon = async () => {
    try {
      console.log("API")
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
}, []);

  const searchData = pokemon.filter((curPokemon) =>
    curPokemon.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="no-results info-message">Loading...</p>;
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
