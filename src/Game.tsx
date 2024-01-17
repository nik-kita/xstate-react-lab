import { useEffect } from "react";
import { GameContext } from "./GameContext";

export default function Game() {
  const game = GameContext.useActorRef();

  useEffect(() => {
    const subscription = game.subscribe((state) => {
    });

    return subscription.unsubscribe;
  }, [game]);

  return (
    <div>
      <h1>Game</h1>
    </div>
  );
}
