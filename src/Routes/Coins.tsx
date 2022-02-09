import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { fetchCoins } from "../api";
import { Helmet } from "react-helmet";

const Container = styled.div`
	max-width: 500px;
	margin: 0 auto;
`;
const Header = styled.header`
	height: 15vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;
const Title = styled.h1`
	font-size: 45px;
	color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
	display: block;
	text-align: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
	background-color: white;
	color: ${(props) => props.theme.bgColor};
	margin-bottom: 10px;
	border-radius: 15px;
	a {
		font-size: 20px;
		font-weight: 500;
		padding: 20px;
		display: flex;
		align-items: center;
		transition: color 0.2s ease-in-out;
	}
	&:hover {
		a {
			color: ${(props) => props.theme.accentColor};
		}
	}
`;
const Img = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 10px;
`;
interface ICoin {
	id: string;
	name: string;
	symbol: string;
	rank: number;
	is_new: boolean;
	is_active: boolean;
	type: string;
}

function Coins() {
	const { isLoading, data } = useQuery<ICoin[]>("allcoins", fetchCoins);
	return (
		<Container>
			<Helmet>
				<title>Coin</title>
			</Helmet>
			<Header>
				<Title>Coin Tracker</Title>
			</Header>
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<CoinsList>
					{data?.slice(0, 100).map((coin) => (
						<Coin key={coin.id}>
							<Link
								to={`/${coin.id}`}
								state={{ name: coin.name }}
							>
								<Img
									src={`https://cryptoicon-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`}
									alt={`${coin.name}`}
								></Img>
								{coin.name} &rarr;
							</Link>
						</Coin>
					))}
				</CoinsList>
			)}
		</Container>
	);
}

export default Coins;
