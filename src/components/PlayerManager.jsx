import React, { useState } from "react";

const PlayerManager = ({ players, setPlayers, setActivePlayers }) => {
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() === "") return;

    const newPlayer = { id: Date.now(), name: newPlayerName, location: "bench" };

    setPlayers(prev => [...prev, newPlayer]);
    console.log(`✅ Player Added: ID=${newPlayer.id}, Name=${newPlayer.name}, Location=Bench`);
    setNewPlayerName("");
  };

  const movePlayer = (playerId, newLocation) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player =>
        player.id === playerId ? { ...player, location: newLocation } : player
      );

      const updatedActivePlayers = updatedPlayers.filter(player => player.location === "court").slice(0, 6);
      setActivePlayers(updatedActivePlayers);

      const movedPlayer = updatedPlayers.find(player => player.id === playerId);
      console.log(`🔄 Player Moved: ID=${movedPlayer.id}, Name=${movedPlayer.name}, New Location=${newLocation}`);

      return updatedPlayers;
    });
  };

  return (
    <div>
      <h3>Manage Players</h3>
      <ul>
        {players.map((player) => (
          <li key={player.id}>
            {player.name}
            <button onClick={() => movePlayer(player.id, player.location === "bench" ? "court" : "bench")}>
              {player.location === "bench" ? "Move to Court" : "Move to Bench"}
            </button>
            <button onClick={() => {
              console.log(`❌ Player Removed: ID=${player.id}, Name=${player.name}`);
              setPlayers(prev => prev.filter(p => p.id !== player.id));
            }}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="New Player Name"
        value={newPlayerName}
        onChange={(e) => setNewPlayerName(e.target.value)}
      />
      <button onClick={addPlayer}>Add Player</button>
    </div>
  );
};

export default PlayerManager;







