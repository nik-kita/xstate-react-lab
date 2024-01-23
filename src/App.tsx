import "./App.css";
import Game from "./Game";
import { GameContext } from "./GameContext";

function App() {
  return (
    <GameContext.Provider>
      <div
        style={{
          height: "100vh",
          width: "100vw",
        }}
      >
        <Game />
      </div>
    </GameContext.Provider>
  );
}

export default App;
