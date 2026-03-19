import React, { useMemo } from "react";
import PokemonCard from "./PokemonCard";

export default function FavouritePokemons({ allPokemon, favourites, toggleFavourite }) {
  const favouritePokemon = useMemo(() => {
    return allPokemon.filter((p) => favourites.includes(p.id));
  }, [allPokemon, favourites]);

  if (favouritePokemon.length === 0) {
    return (
      <div className="no-results">
        <p>No favourite Pokémon yet.</p>
      </div>
    );
  }

  return (
    <section className="container">
      <header>
        <h1>Your Favourite Pokémon</h1>
      </header>
      <ul className="cards">
        {favouritePokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemonData={pokemon}
            isFavourite={true}
            onFavouriteToggle={toggleFavourite}
          />
        ))}
      </ul>
    </section>
  );
}