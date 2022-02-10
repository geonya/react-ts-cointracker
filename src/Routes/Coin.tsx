import styled from "styled-components";
import {
	Link,
	Routes,
	Route,
	useParams,
	useLocation,
	useMatch,
} from "react-router-dom";
import Price from "./Price";
import Chart from "./Chart";
import { useQuery } from "react-query";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
	padding: 0px 20px;
	max-width: 500px;
	margin: 0 auto;
`;
const Loader = styled.span`
	display: block;
	text-align: center;
`;

const Header = styled.header`
	height: 15vh;
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	a:first-child {
		padding: 15px;
		font-size: 30px;
		position: absolute;
		left: 0;
		top: 0vh;
	}
`;
const Title = styled.h1`
	color: ${(props) => props.theme.accentColor};
	font-size: 45px;
`;
const Overview = styled.div`
	display: flex;
	justify-content: space-between;
	background-color: ${(props) => props.theme.cardBgColor};
	border: 1px solid white;
	padding: 10px 20px;
	border-radius: 10px;
`;
const OverviewItem = styled.div`
	display: flex;
	flex-direction: column;
	span:first-child {
		font-size: 12px;
		font-weight: 400;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
`;
const Description = styled.p`
	margin: 20px 0px;
`;
const Tabs = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	margin: 25px 0px;
	gap: 10px;
`;
const Tab = styled.div<{ isActive: boolean }>`
	text-align: center;
	text-transform: uppercase;
	font-size: 12px;
	font-weight: 400;
	background-color: ${(props) => props.theme.cardBgColor};
	padding: 7px;
	border-radius: 10px;
	border: 1px solid white;
	color: ${(props) =>
		props.isActive ? props.theme.accentColor : props.theme.textColor};
	a {
		display: block;
	}
`;

interface RouteState {
	name: string;
}
interface IInfoData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	description: string;
}

interface IPriceData {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	circulating_supply: number;
	total_supply: number;
	max_supply: number;
	beta_value: number;
	quotes: {
		USD: {
			price: number;
			volume_24h: number;
			volume_24h_change_24h: number;
			market_cap: number;
			market_cap_change_24h: number;
			percent_change_15m: number;
			percent_change_30m: number;
			percent_change_1h: number;
			percent_change_6h: number;
			percent_change_12h: number;
			percent_change_24h: number;
			percent_change_7d: number;
			percent_change_30d: number;
			percent_change_1y: number;
			ath_price: number;
			ath_date: string;
			percent_from_price_ath: number;
		};
	};
}

interface ICoinProps {}

function Coin({}: ICoinProps) {
	type IParams = { coinId: string };
	const { coinId } = useParams() as IParams;
	const location = useLocation();
	const state = location.state as RouteState;
	const priceMatch = useMatch(`${coinId}/price`);
	const chartMatch = useMatch(`${coinId}/chart`);

	const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
		["info", coinId],
		() => fetchCoinInfo(coinId!)
	);
	const { isLoading: tickersLoading, data: priceData } = useQuery<IPriceData>(
		["tickers", coinId],
		() => fetchCoinTickers(coinId!)
	);
	const loading = infoLoading || tickersLoading;
	return (
		<Container>
			<Helmet>
				<title>
					{state?.name
						? state.name
						: loading
						? "Loading..."
						: infoData?.name}
				</title>
			</Helmet>
			<Header>
				<Link to={"/"}>&larr;</Link>
				<Title>
					{state?.name
						? state.name
						: loading
						? "Loading..."
						: infoData?.name}
				</Title>
			</Header>
			{loading ? (
				<Loader>Loading...</Loader>
			) : (
				<>
					<Overview>
						<OverviewItem>
							<span>Rank:</span>
							<span>{infoData?.rank}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Symbol:</span>
							<span>{infoData?.symbol}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Price:</span>
							<span>
								$ {priceData?.quotes?.USD?.price.toFixed(2)}
							</span>
						</OverviewItem>
					</Overview>
					<Description>{infoData?.description}</Description>
					<Overview>
						<OverviewItem>
							<span>Total Supply:</span>
							<span>{priceData?.total_supply}</span>
						</OverviewItem>
						<OverviewItem>
							<span>Max Supply:</span>
							<span>{priceData?.max_supply}</span>
						</OverviewItem>
					</Overview>
					<Tabs>
						<Tab isActive={priceMatch !== null}>
							<Link to={"price"}>Price</Link>
						</Tab>
						<Tab isActive={chartMatch !== null}>
							<Link to={"chart"}>Chart</Link>
						</Tab>
					</Tabs>
					<Routes>
						<Route
							path="price"
							element={<Price coinId={coinId!} />}
						></Route>
						<Route
							path="chart"
							element={<Chart coinId={coinId!} />}
						></Route>
					</Routes>
				</>
			)}
		</Container>
	);
}

export default Coin;
