import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Bulbasaur from "./Bulbasaur"; // your 3D component

export default function PokemonDetailView({ isModal = false }) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialPokemon = location.state?.pokemon || null;
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [loading, setLoading] = useState(!initialPokemon);
  const [error, setError] = useState(null);
  const [show3DView, setShow3DView] = useState(false);

  const fetchedIdRef = useRef(null);

  useEffect(() => {
    // If we already have the correct pokemon, do nothing
    if (pokemon && pokemon.id == id) {
      fetchedIdRef.current = id;
      return;
    }

    // If we already fetched this exact id before, avoid re-fetch
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

  const viewerOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10000,
  };

  const viewerContentStyle = {
    width: "min(900px, 95%)",
    height: "80vh",
    borderRadius: "12px",
    background: "#1a1a1a",
    padding: 20,
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

  const image =
    pokemon.sprites?.other?.["official-artwork"]?.front_default ||
    pokemon.sprites?.other?.dream_world?.front_default ||
    pokemon.sprites?.front_default ||
    "";

  if (show3DView && pokemon.name === "bulbasaur") {
    return (
      <div style={viewerOverlayStyle} onClick={() => setShow3DView(false)}>
        <div style={viewerContentStyle} onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setShow3DView(false)}
            aria-label="Close 3D View"
            style={{
              position: "absolute",
              right: 12,
              top: 12,
              background: "transparent",
              border: "none",
              fontSize: 24,
              color: "white",
              cursor: "pointer",
              zIndex: 10001,
            }}
          >
            ✕
          </button>
          <h3 style={{ color: "white", textAlign: "center", marginBottom: 20 }}>
            3D Model of Bulbasaur
          </h3>
          <Bulbasaur />
        </div>
      </div>
    );
  }

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

          {pokemon.name === "bulbasaur" && (
            <button
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "none",
                background: "#4CAF50",
                color: "white",
                cursor: "pointer",
                marginTop: "8px",
                marginBottom: "16px",
              }}
              onClick={() => setShow3DView(true)}
            >
              VIEW 3D MODEL • Feature Not finished yet
            </button>
          )}

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

  return <div style={{ padding: 24 }}>{body}</div>;
}