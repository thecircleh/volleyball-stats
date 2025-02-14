import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaLock, FaLockOpen, FaVolleyballBall } from "react-icons/fa";
import "./CourtView.css";

const CourtView = ({ activePlayers, setActivePlayers, courtLocked, toggleCourtLock, onBallMove }) => {
  const [ballPosition, setBallPosition] = useState({ top: -50, left: "50%" });

  useEffect(() => {
    console.log("Ball moved to:", ballPosition); // Debugging log
  }, [ballPosition]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.draggableId === "volleyball") {
      const newLocation = result.destination.droppableId;
      let newPos = { ...ballPosition }; // Copy current position

      if (newLocation === "in-play"&& activePlayers.length > 0) {
        newPos = { top: -150, left: "70%" }; // Moves ball to in-play zone
      } else if (newLocation === "kill" && activePlayers.length > 0) {
        newPos = { top: 100, left: "77%" }; // Moves ball to server position after kill
        onBallMove("kill");
      } else if (newLocation === "error") {
        newPos = { top: -150, left: "45%" }; // Moves ball to error zone
        onBallMove("error");
      } else if (newLocation === "opponent-service") {
      newPos = { top: -150, left: "45%" };  // ✅ New Opponent Service Zone
      onBallMove("opponent-service");
      }
      console.log(`Ball moving to: ${newLocation}`, newPos); // Debugging log
      setBallPosition(newPos); // Apply new position
    } else {
      if (courtLocked) return;

      const updatedPlayers = Array.from(activePlayers);
      const [movedPlayer] = updatedPlayers.splice(result.source.index, 1);
      updatedPlayers.splice(result.destination.index, 0, movedPlayer);

      setActivePlayers(updatedPlayers);
    }
  };

  return (
    <div className="court-container">
      <h3>Volleyball Court</h3>

      <div className="court-status">
        {courtLocked ? <FaLock size={24} color="red" /> : <FaLockOpen size={24} color="green" />}
        <span>{courtLocked ? "Court Locked" : "Court Unlocked"}</span>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
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

        <div className="court-layout">
          {courtLocked && (
            <Droppable droppableId="error">
              {(provided) => (
                <div ref={provided.innerRef} className="error-zone">
                  Error
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
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
                              className={`player-box ${index + 3 === 5 ? "server" : ""}`} // ✅ Highlight Position 1 (index 5) 
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
      </DragDropContext>


    </div>
  );
};

export default CourtView;

