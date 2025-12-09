import Game from "./components/Game";
import { AppKitProvider } from "./hooks/useProvider";

const App = () => {
	return (
		<AppKitProvider>
			<Game />
		</AppKitProvider>
	);
};
export default App;
