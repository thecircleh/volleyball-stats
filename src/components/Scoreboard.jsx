import React from "react";
import "./Scoreboard.css"; // ✅ Make sure this file exists

const Scoreboard = ({ homeTeam, visitorTeam, currentSet, setsWon, scores }) => {
  return (
    <div className="scoreboard">
      <div className="team-names">
        <div className="team">{homeTeam || "Home"}</div>
        <div className="vs">VS</div>
        <div className="team">{visitorTeam || "Visitor"}</div>
      </div>

      <div className="set-info">
        <div className="set-number">Set {currentSet}</div>
        <div className="sets-won">
          <span>{setsWon.home}</span> - <span>{setsWon.visitor}</span>
        </div>
      </div>

      <div className="current-score">
        <div className="score">
          {scores.home}
        </div>
        <div className="score">
          {scores.visitor}
        </div>
      </div>
    </div>
  );
};

export default Scoreboard; // ✅ Move `export default` to the end

