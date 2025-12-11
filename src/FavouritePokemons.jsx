import PokemonCard from "./PokemonCard";

export default function FavouritePokemons({
  pokemon,
  favourites,
  toggleFavourite,
}) {
  const favouritePokemonData = pokemon.filter((p) => favourites.includes(p.id));

  if (favouritePokemonData.length === 0) {
    return <p className="no-results info-message">No favourites yet.</p>;
  }

  return (
    <>
      <section className="container">
        <header>
          <h1>All Your Favourites</h1>
        </header>

        <div>
          <ul className="cards">
          {favouritePokemonData.map((curPokemon) => (
            <PokemonCard
              key={curPokemon.id}
              pokemonData={curPokemon}
              isFavourite={favourites.includes(curPokemon.id)}
              onFavouriteToggle={toggleFavourite}
            />
          ))}
          </ul>
        </div>
      </section>
    </>
  );
}