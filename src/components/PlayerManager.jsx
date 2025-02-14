import React, { useState } from "react";

const PlayerManager = ({ players, setPlayers, updateActivePlayers }) => {
  const [newPlayerName, setNewPlayerName] = useState("");

  const addPlayer = () => {
    if (newPlayerName.trim() === "") return;

    setPlayers(prev => [
      ...prev,
      { id: Date.now(), name: newPlayerName, active: false } // ✅ Guarantees unique IDs
    ]);

    setNewPlayerName(""); // ✅ Clears input after adding player
  };

  const toggleActiveStatus = (clickedPlayerId) => {
    setPlayers(prevPlayers => {
      const updatedPlayers = prevPlayers.map(player =>
        player.id === clickedPlayerId ? { ...player, active: !player.active } : player
      );

      setTimeout(() => updateActivePlayers(updatedPlayers), 0); // ✅ Passes updatedPlayers to ensure immediate sync

      return updatedPlayers;
    });
  };

  return (
    <div>
      <h3>Manage Players</h3>
      <ul>
        {players.map(player => (
          <li key={player.id}>
            {player.name}
            <button onClick={() => toggleActiveStatus(player.id)}>
              {player.active ? "Deactivate" : "Activate"}
            </button>
            <button onClick={() => setPlayers(prev => prev.filter(p => p.id !== player.id))}>
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




