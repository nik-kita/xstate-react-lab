import "./App.css";
import Game from "./Game";
import { GameContext } from "./GameContext";

function App() {
  return (
    <GameContext.Provider>
      <div>
        <Game />
      </div>
    </GameContext.Provider>
  );
}

export default App;
