import { useState } from "react";
import Game from "./components/Game";
import LandingPage from "./components/LandingPage";

const App = () => {
	const [inGame, setInGame] = useState(false);

	if (inGame) {
		return <Game onExitToHome={() => setInGame(false)} />;
	}

	return <LandingPage onPlay={() => setInGame(true)} />;
};

export default App;
