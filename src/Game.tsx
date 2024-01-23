import { useEffect, useState } from "react";
import css from "./Game.module.css";
import { GameContext } from "./GameContext";
import { MATRIX } from "./const";
import { Tetromino } from "./game/engine/tetromino";
import { GameEventGenerator } from "./game/machine/events";
import { rand_int } from "./utils/rand_int";
import Buttons from "./Buttons";

export default function Game() {
  const cells = GameContext.useSelector((snapshot) => {
    return [...snapshot.context.matrix?._cells || []];
  });
  const actor_ref = GameContext.useActorRef();

  useEffect(() => {
    actor_ref.send(GameEventGenerator.GENERATE_MATRIX(MATRIX.x, MATRIX.y));
    const subscription = actor_ref.subscribe((snapshot) => {
      if (snapshot.matches("Tetromino_creation")) {
        const t = Tetromino.random;
        const x = rand_int(MATRIX.x - t._cols);
        console.log(x, MATRIX.x);
        actor_ref.send(
          GameEventGenerator.ADD_TO_MATRIX(
            t,
            x,
          ),
        );
      }
    });

    const hjkl = (ev: KeyboardEvent) => {
      if (ev.key === "h" || ev.key === "ArrowLeft") {
        actor_ref.send(GameEventGenerator.MOVE_LEFT());
      } else if (ev.key === "j" || ev.key === "ArrowDown") {
        actor_ref.send(GameEventGenerator.MOVE_DOWN());
      } else if (ev.key === "k" || ev.key === "ArrowUp") {
        actor_ref.send(GameEventGenerator.MOVE_UP());
      } else if (ev.key === "l" || ev.key === "ArrowRight") {
        actor_ref.send(GameEventGenerator.MOVE_RIGHT());
      } else if (ev.key === "Enter") {
        actor_ref.send(GameEventGenerator.REPEAT_GAME());
        actor_ref.send(GameEventGenerator.GENERATE_MATRIX(MATRIX.x, MATRIX.y));
      }
    };
    window.addEventListener("keyup", hjkl);

    const auto = setInterval(() => {
      actor_ref.send(GameEventGenerator.MOVE_DOWN());
    }, 150);

    return () => {
      window.removeEventListener("keyup", hjkl);
      clearInterval(auto);
      subscription.unsubscribe();
    };
  }, [actor_ref]);

  return (
    <>
      <div
        style={{
          height: "90vh",
          display: "grid",
          gridTemplateColumns: `repeat(${MATRIX.x}, 1fr)`,
          gridTemplateRows: `repeat(${MATRIX.y}, 1fr)`,
        }}
      >
        {cells.map((c, i) => {
          return (
            <div
              key={i}
              className={c.free
                ? css["cell"]
                : css["cell"] + " " + css["cell-active"]}
            >
            </div>
          );
        })}
      </div>
      <Buttons />
    </>
  );
}
