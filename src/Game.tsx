import { GameContext } from "./GameContext";
import { GameEventGenerator } from "./game/machine/events";

export default function Game() {
  const m = GameContext.useSelector((snapshot) => snapshot.context.matrix);
  const actor_ref = GameContext.useActorRef();
  return (
    <div>
      <h1>Game</h1>
      <pre>{JSON.stringify(m, null, 1)}</pre>
      <button
        onClick={() => {
          actor_ref.send(GameEventGenerator.GENERATE_MATRIX(2, 4));
        }}
      >
        generate matrix
      </button>
    </div>
  );
}
