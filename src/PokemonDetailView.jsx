import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import "./PokemonDetailView.css";

export default function PokemonDetailView({ isModal = false }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialPokemon = location.state?.pokemon || null;
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [loading, setLoading] = useState(!initialPokemon);
  const [error, setError] = useState(null);

  const fetchedIdRef = useRef(null);

  const typeColors = {
    normal: "#929aa1",
    fire: "#f0a161",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#be496a",
    poison: "#b65eaa",
    ground: "#cc7d4f",
    flying: "#95a9da",
    psychic: "#e8797a",
    bug: "#9bc047",
    rock: "#c4b890",
    ghost: "#5669a8",
    dragon: "#316bc0",
    dark: "#585364",
    steel: "#658da0",
    fairy: "#df93e1",
  };

  const statLabels = {
    hp: "HP",
    attack: "ATK",
    defense: "DEF",
    "special-attack": "SPA",
    "special-defense": "SPD",
    speed: "SPD",
  };

  useEffect(() => {
    if (pokemon && pokemon.id == id) {
      fetchedIdRef.current = id;
      return;
    }

    if (fetchedIdRef.current === id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await res.json();
        setPokemon(data);
        fetchedIdRef.current = id;
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, pokemon]);

  const close = () => {
    if (location.state?.background) navigate(-1);
    else navigate("/");
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!pokemon) return <div>Not found</div>;

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.front_default;

  const mainType = pokemon.types[0].type.name;
  const color = typeColors[mainType] || "#999";

  const statData = pokemon.stats.map((s) => ({
    stat: statLabels[s.stat.name] || s.stat.name,
    value: Math.min(s.base_stat, 150),
  }));

  return (
    <div
      className="pokemon-detail-wrapper"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="pokemon-card-new" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={close}>
          ✕
        </button>

        {/* HERO */}
        <div
          className="pokemon-hero"
          style={{
            background: `linear-gradient(135deg, ${color}, #000)`,
          }}
        >
          <div className="pokemon-hero-blur" style={{ background: color }} />

          <img src={image} alt={pokemon.name} className="pokemon-hero-img" />
        </div>

        {/* CONTENT */}
        <div className="pokemon-content">

          <div className="pokemon-title">{pokemon.name}</div>
          {/* INFO */}
          <div className="info-row">
            <div>
              <p>{pokemon.weight}kg</p>
              <span>Weight</span>
            </div>
            <div>
              <p>{pokemon.types[0]?.type.name}</p>
              <span>Type</span>
            </div>
            <div>
              <p>{pokemon.height}m</p>
              <span>Height</span>
            </div>
          </div>

          {/* ABILITIES */}
          <div className="abilities">
            
            {pokemon.abilities.slice(0, 2).map((a) => (
              <div key={a.ability.name} className="ability-card">
                {a.ability.name}
              </div>
            ))}
          </div>

          {/* 🔥 RADAR GRAPH */}
          <div className="radar-wrapper">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={statData}>
                <PolarGrid />

                <PolarAngleAxis
                  dataKey="stat"
                  tick={({ payload, x, y, textAnchor }) => {
                    const stat = statData.find((s) => s.stat === payload.value);

                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text textAnchor={textAnchor} fill="#666" fontSize={12}>
                          {payload.value}
                        </text>

                        <text
                          dy={14}
                          textAnchor={textAnchor}
                          fill="#000"
                          fontSize={13}
                          fontWeight="bold"
                        >
                          {stat?.value}
                        </text>
                      </g>
                    );
                  }}
                />

                <Radar
                  dataKey="value"
                  stroke={color}
                  fill={color}
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
