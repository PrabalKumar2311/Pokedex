import React, { useEffect, useState } from 'react'
import "./index.css"
import { PokemonCard } from './PokemonCard';

function Pokemon() {

  const [pokemon,setPokemon] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [search,setSearch] = useState("");

  const API = "https://pokeapi.co/api/v2/pokemon?limit=500";

  const fetchPokemon = async() => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      // console.log(data)
      //This is the method to get data from a API

      const detailedPokemonData = data.results.map( async (curPokemon) => {
        // console.log(curPokemon.url)

        const res = await fetch(curPokemon.url)
        const data = await res.json()
        // console.log(data)
        return data;
      })
      // console.log(detailedPokemonData)
      //Cause this API has link inside it we have to do the extra step here

      const detailedResponses = await Promise.all(detailedPokemonData)
      console.log(detailedResponses)
      setPokemon(detailedResponses);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error);
    }
  }

  useEffect(() => {
    fetchPokemon();
  },[]);


  //Search func

  const searchData = pokemon.filter((curPokemon) => curPokemon.name.toLowerCase().includes(search.toLowerCase()));

  if(loading){
    return (
    <p className='no-results'>Loading...</p>
    )
  }

  if(error){
    return (
    <p className='no-results'>{error.message}</p>
    )
  }

  return (

    <>
    <section className='container'>
      <header>
        <h1>
          Welcome To Pokedex
        </h1>
      </header>

      <div className="pokemon-search">
        <input type='text' placeholder='Search Pokemon' value={search} onChange={(e) => setSearch(e.target.value)}/>
        {/* <div className="search-cross">
          {search !== "" && (
            <svg
              onClick={() => setSearch("")}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
              width="18"              
              height="18"
              style={{ cursor: "pointer", fill: "#555" }}
              aria-label="Clear search"
              role="button"
            >
              <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/>
            </svg>
          )}
        </div> */}

      </div>
      <div>
  {searchData.length === 0 ? (
    <p className="no-results">No Pokémon found.</p>
  ) : (
    <ul className="cards">
      {searchData.map((curPokemon) => (
        <PokemonCard key={curPokemon.id} pokemonData={curPokemon} />
      ))}
    </ul>
  )}
</div>

    </section>
    </>
  )
}

export default Pokemon
