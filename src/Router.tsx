import { BrowserRouter, Routes, Route } from "react-router-dom";
import Coins from "./Routes/Coins";
import Coin from "./Routes/Coin";

interface IRouterProps {}

function Router({}: IRouterProps) {
	return (
		<BrowserRouter basename={process.env.PUBLIC_URL}>
			<Routes>
				<Route path="/:coinId/*" element={<Coin />}></Route>
				<Route path="/" element={<Coins />}></Route>
			</Routes>
		</BrowserRouter>
	);
}

export default Router;
