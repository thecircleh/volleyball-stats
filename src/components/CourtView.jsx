import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaLock, FaLockOpen, FaVolleyballBall, FaRedo } from "react-icons/fa";
import Scoreboard from "./Scoreboard"; // ✅ Import Scoreboard component
import "./CourtView.css";

const CourtView = ({ activePlayers = [], setActivePlayers, rotatePlayers, courtLocked, toggleCourtLock,  onBallMove,  allPlayers = [] }) => {
  const [scores, setScores] = useState({ home: 0, visitor: 0 });
  const [setsWon, setSetsWon] = useState({ home: 0, visitor: 0 });
  const [currentSet, setCurrentSet] = useState(1);
  const [homeTeam, setHomeTeam] = useState("");
  const [visitorTeam, setVisitorTeam] = useState("");
  const [ballPosition, setBallPosition] = useState({ top: -50, left: "50%" });
  
  
  
  const benchPlayers = allPlayers.filter(player => !activePlayers.includes(player));

  useEffect(() => {
    console.log("Ball moved to:", ballPosition);
  }, [ballPosition]);

 const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.draggableId.startsWith("player-")) {
      const playerId = parseInt(result.draggableId.replace("player-", ""), 10);
      const draggedPlayer = allPlayers.find(player => player.id === playerId);

      if (result.destination.droppableId === "bench") {
        setActivePlayers(prev => prev.filter(player => player.id !== playerId));
      } else {
        if (!activePlayers.some(player => player.id === playerId)) {
          setActivePlayers(prev => [...prev, draggedPlayer]);
        }
      }
    }

    if (result.draggableId === "volleyball") {
      const newLocation = result.destination.droppableId;
      let newPos = { ...ballPosition };

      if (newLocation === "in-play" && activePlayers.length > 0) {
        newPos = { top: -52, left: "128%" };
      } else if (newLocation === "kill" && activePlayers.length > 0) {
        newPos = { top: 75, left: "75%" };
        onBallMove("kill");
      } else if (newLocation === "error") {
        newPos = { top: -58, left: "40%" };
        onBallMove("error");
      } else if (newLocation === "opponent-service") {
        onBallMove("opponent-service");
      } else if (newLocation === "free-ball") {
        onBallMove("free-ball");
      }

      console.log(`Ball moving to: ${newLocation}`, newPos);
      setBallPosition(newPos);
    }
  };

  return (
    <div className="court-container">
      <div className="court-status">
        {courtLocked ? <FaLock size={24} color="red" /> : <FaLockOpen size={24} color="green" />}
        <span>{courtLocked ? "Court Locked" : "Court Unlocked"}</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="court-wrapper">
          <div className="court-layout">
            {courtLocked && (
              <div className="court-zones">
                <Droppable droppableId="kill">
                  {(provided) => (
                    <div ref={provided.innerRef} className="kill-zone">
                      Kill
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="opponent-service">
                  {(provided) => (
                    <div ref={provided.innerRef} className="opponent-service-zone">
                      Opponent Service
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="free-ball">
                  {(provided) => (
                    <div ref={provided.innerRef} className="free-ball-zone">
                      Free Ball
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
				<Droppable droppableId="error">
                  {(provided) => (
                    <div ref={provided.innerRef} className="error-zone">
                      Error
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <Droppable droppableId="in-play">
                  {(provided) => (
                    <div ref={provided.innerRef} className="inplay-zone">
                      In Play
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            )}

            <Droppable droppableId="court" isDropDisabled={courtLocked}>
              {(provided) => (
                <div className="court" {...provided.droppableProps} ref={provided.innerRef}>
                  <div className="net">NET</div>

                  <div className="row">
                    {["4", "3", "2"].map((pos, index) => (
                      <div key={pos} className="court-position">
                        {activePlayers[index] && (
                          <Draggable
                            key={activePlayers[index].id}
                            draggableId={`player-${activePlayers[index].id}`}
                            index={index}
                            isDragDisabled={courtLocked}
                          >
                            {(provided) => (
                              <div
                                className="player-box"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {activePlayers[index].name}
                              </div>
                            )}
                          </Draggable>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="row">
                    {["5", "6", "1"].map((pos, index) => (
                      <div key={pos} className="court-position">
                        {activePlayers[index + 3] && (
                          <Draggable
                            key={activePlayers[index + 3].id}
                            draggableId={`player-${activePlayers[index + 3].id}`}
                            index={index + 3}
                            isDragDisabled={courtLocked}
                          >
                            {(provided) => (
                              <div
                                className={`player-box ${index + 3 === 5 ? "server" : ""}`}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                {activePlayers[index + 3].name}
                              </div>
                            )}
                          </Draggable>
                        )}
                      </div>
                    ))}
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <Droppable droppableId="volleyball-area">
              {(provided) => (
                <div ref={provided.innerRef} className="volleyball-container"
                  style={{ position: "absolute", top: `${ballPosition.top}px`, left: ballPosition.left }}>
                  <Draggable draggableId="volleyball" index={0}>
                    {(provided) => (
                      <div
                        className="volleyball"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <FaVolleyballBall />
                      </div>
                    )}
                  </Draggable>
                </div>
              )}
            </Droppable>
          </div>
        </div>
      
      


        {/* ✅ Bench Section */}
        <Droppable droppableId="bench" direction="horizontal">
          {(provided) => (
            <div className="bench-container" ref={provided.innerRef} {...provided.droppableProps}>
              <h3>Bench</h3>
              {benchPlayers.map((player, index) => (
                <Draggable key={player.id} draggableId={`player-${player.id}`} index={index}>
                  {(provided) => (
                    <div className="bench-player-box"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      {player.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

	  	  <div className="court-controls">
        <button onClick={toggleCourtLock} title="Lock/Unlock Court">
          {courtLocked ? <FaLockOpen size={24} /> : <FaLock size={24} />}
        </button>
        <button onClick={rotatePlayers} title="Rotate Players">
          <FaRedo size={24} />
        </button>
      </div>
	  
      {/* ✅ Scoreboard is now below the court */}
      <div className="scoreboard-container">
        <Scoreboard
          homeTeam={homeTeam}
          visitorTeam={visitorTeam}
          currentSet={currentSet}
          setsWon={setsWon}
          scores={scores}
        />
      </div>


    </div>
  );
};

export default CourtView;


