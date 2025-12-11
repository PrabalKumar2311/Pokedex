// PokemonCardDetailView.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

export default function PokemonDetailView({ isModal = false }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialPokemon = location.state?.pokemon || null;
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [loading, setLoading] = useState(!initialPokemon);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pokemon) return;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        if (!res.ok) throw new Error("Failed to fetch Pokémon details");
        const data = await res.json();
        setPokemon(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id, pokemon]);

  const close = () => {
    if (location.state && location.state.background) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  };

  const contentStyle = {
    width: isModal ? "min(900px, 95%)" : "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    borderRadius: "12px",
    background: "#fff",
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
    position: "relative",
  };

  if (loading)
    return (
      <div style={{ padding: 24 }}>
        <p>Loading...</p>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 24 }}>
        <p>{error.message}</p>
        <button onClick={close}>Back</button>
      </div>
    );

  if (!pokemon)
    return (
      <div style={{ padding: 24 }}>
        <p>Pokemon not found.</p>
        <button onClick={close}>Back</button>
      </div>
    );

  // image fallback
  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default ||
    "";

  const body = (
    <div style={contentStyle} onClick={(e) => e.stopPropagation()}>
      <button
        onClick={close}
        aria-label="Close"
        style={{
          position: "absolute",
          right: 12,
          top: 12,
          background: "transparent",
          border: "none",
          fontSize: 20,
          cursor: "pointer",
        }}
      >
        ✕
      </button>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
        <img
          src={image}
          alt={pokemon.name}
          style={{
            width: 220,
            height: 220,
            objectFit: "contain",
            background: "#f4f4f4",
            borderRadius: 8,
            padding: 10,
          }}
        />

        <div style={{ flex: 1, minWidth: 250 }}>
          <h2 style={{ textTransform: "capitalize" }}>
            #{pokemon.id} {pokemon.name}
          </h2>

          <p>
            <strong>Types:</strong>{" "}
            {pokemon.types.map((t) => (
              <span key={t.type.name} style={{ marginRight: 8 }}>
                {t.type.name}
              </span>
            ))}
          </p>

          <p>
            <strong>Height:</strong> {pokemon.height}
          </p>
          <p>
            <strong>Weight:</strong> {pokemon.weight}
          </p>
          <p>
            <strong>Abilities:</strong>{" "}
            {pokemon.abilities.map((a) => a.ability.name).join(", ")}
          </p>

          <div style={{ marginTop: 12 }}>
            <strong>Stats</strong>
            <ul>
              {pokemon.stats.map((s) => (
                <li key={s.stat.name}>
                  {s.stat.name}: {s.base_stat}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div style={overlayStyle} onClick={close}>
        {body}
      </div>
    );
  }

  // Full page (non-modal)
  return <div style={{ padding: 24 }}>{body}</div>;
}
