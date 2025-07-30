export const PokemonCard = ({pokemonData}) => {
  return <li className="pokemon-card">
    <figure>
      <img src={pokemonData.sprites.other.dream_world.front_default} 
      alt=""
      className="pokemon-image"></img>
    </figure>
    <h1 className="pokemon-name">{pokemonData.name}</h1>
    <div className="pokemon-info pokemon-highlight">
      <p>{pokemonData.types.map((curType) => curType.type.name).join(", ")}</p>
    </div>

    <div className="grid-three-cols">
      <div className="pokemon-info">
        <span>Height</span>
        <p>{pokemonData.height}</p>
      </div>
      <div className="pokemon-info">
        <span>Weight</span>
        <p>{pokemonData.weight}</p>
      </div>
      <div className="pokemon-info">
        <span>Speed</span>
        <p>{pokemonData.stats[5].base_stat}</p>
      </div>
    </div>

    <div className="grid-three-cols">
      <div className="pokemon-info">
        <span>Experience</span>
        <p>{pokemonData.base_experience}</p>
        
      </div>
      <div className="pokemon-info">
        <span>Attack</span>
        <p>{pokemonData.stats[1].base_stat}</p>
        
      </div>
      <div className="pokemon-info">
        <span>Ablities</span>
        <p>
          {pokemonData.abilities
          .map((abilityInfo) => abilityInfo.ability.name)
          .slice(0,1)
          .join(", ")}
        </p>
        
      </div>
    </div>

    



  </li>
}