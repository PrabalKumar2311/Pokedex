export default function PokemonCard({
  pokemonData,
  isFavourite,
  onFavouriteToggle,
}) {

  const typeColors = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting:"#ae5b4aff",
    poison:"#9f5a96ff",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock:"#b8ab6fff",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark:"#725647ff",
    steel: "#B7B7CE",
    fairy: "#D685AD",
  };

  return (
    <li className="pokemon-card">
      <p className="star">
        <i
          className={isFavourite ? "fa-solid fa-star" : "fa-regular fa-star"}
          onClick={() => onFavouriteToggle(pokemonData.id)}
          style={{ color: isFavourite ? "#FFD700" : "#9e9e9e" }}
        ></i>
      </p>

      <figure>
        <img
          src={pokemonData.sprites.other.dream_world.front_default}
          alt=""
          className="pokemon-image"
        />
      </figure>

      <h1 className="pokemon-name">{pokemonData.name}</h1>
      
      <div className="pokemon-info pokemon-highlight">
        {pokemonData.types.map((curType, idx) => {
          const typeName = curType.type.name.toLowerCase();
          return (
            <span
              key={idx}
              className="pokemon-type"
              style={{
                backgroundColor: typeColors[typeName] || "#ccc",
                color: "#fff",
                
              }}
            >
              {typeName}
            </span>
          );
        })}
      </div>

      <div className="grid-three-cols">
        <div className="pokemon-info">
          <span>HEIGHT</span>
          <p>{pokemonData.height}m</p>
        </div>
        <div className="pokemon-info">
          <span>WEIGHT</span>
          <p>{pokemonData.weight}kg</p>
        </div>
        <div className="pokemon-info">
          <span>SPEED</span>
          <p>{pokemonData.stats[5].base_stat}</p>
        </div>
      </div>

      <div className="grid-three-cols">
        <div className="pokemon-info">
          <span>EXPERIENCE</span>
          <p>{pokemonData.base_experience}</p>
        </div>
        <div className="pokemon-info">
          <span>ATTACK</span>
          <p>{pokemonData.stats[1].base_stat}</p>
        </div>
        <div className="pokemon-info">
          <span>ABILITIES</span>
          <p className="no-wrap">
            {pokemonData.abilities
              .map((abilityInfo) => abilityInfo.ability.name)
              .slice(0, 1)
              .join(", ")}
          </p>
        </div>
      </div>
    </li>
  );
}
