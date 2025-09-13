export default function PokemonCard ({ pokemonData, isFavourite, onFavouriteToggle }){
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
      <p>{pokemonData.types.map((curType) => curType.type.name).join(", ")}</p>
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
        <p>
          {pokemonData.abilities
          .map((abilityInfo) => abilityInfo.ability.name)
          .slice(0,1)
          .join(", ")}
        </p>
      </div>
    </div>
  </li>
  )
}
