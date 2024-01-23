import { GameContext } from "./GameContext";
import { MATRIX } from "./const";
import { GameEventGenerator } from "./game/machine/events";

export default function Buttons() {
  const actor_ref = GameContext.useActorRef();

  if (actor_ref.getSnapshot().value === "Game_over") {
    return (
      <button
        style={{
          position: "absolute",
          width: "100vw",
          height: "100vh",
        }}
        onClick={() => {
          actor_ref.send(GameEventGenerator.REPEAT_GAME());
          actor_ref.send(
            GameEventGenerator.GENERATE_MATRIX(MATRIX.x, MATRIX.y),
          );
        }}
      >
        Play again!
      </button>
    );
  }
}
