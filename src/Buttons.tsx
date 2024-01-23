import css from "./Buttons.module.css";
import { GameContext } from "./GameContext";
import { MATRIX } from "./const";
import { GameEventGenerator } from "./game/machine/events";

export default function Buttons() {
  const actor_ref = GameContext.useActorRef();

  if (actor_ref.getSnapshot().value === "Game_over") {
    return (
      <button
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

  return (
    <div className={css["hjkl"]}>
      <button
        onClick={() => {
          actor_ref.send(GameEventGenerator.MOVE_LEFT());
        }}
      >
        H
      </button>
      <button
        onClick={() => {
          actor_ref.send(GameEventGenerator.MOVE_DOWN());
        }}
      >
        J
      </button>
      <button
        onClick={() => {
          actor_ref.send(GameEventGenerator.MOVE_UP());
        }}
      >
        K
      </button>
      <button
        onClick={() => {
          actor_ref.send(GameEventGenerator.MOVE_RIGHT());
        }}
      >
        L
      </button>
    </div>
  );
}
