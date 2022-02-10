import { useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import { fetchCoinHistory } from "../api";

const PriceBoard = styled.div`
	max-width: 500px;
	height: 350px;
	display: flex;
	flex-direction: column;
`;
const SelecBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 15px;
	span:first-child {
		font-weight: 600;
		text-align: center;
	}
`;

const SelectDate = styled.select`
	width: 100px;
	font-size: 15px;
	border: none;
	padding: 5px 10px;
	margin: 10px;
	background-color: transparent;
	color: ${(props) => props.theme.textColor};
	&:focus {
		border: none;
	}
`;

const Overview = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	justify-items: center;
	gap: 10px;
	padding: 10px 20px;
	border-radius: 10px;
	margin-bottom: 10px;
`;

const OverviewItem = styled.div`
	width: 90%;
	background-color: ${(props) => props.theme.cardBgColor};
	border: 1px solid white;
	height: 60px;
	border-radius: 999px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	span:first-child {
		text-align: center;
		font-size: 12px;
		font-weight: 400;
		text-transform: uppercase;
		margin-bottom: 5px;
	}
	span:last-child {
		text-align: center;
	}
`;

interface ChartProps {
	coinId: string;
}
interface IHistory {
	close: number;
	high: number;
	low: number;
	market_cap: number;
	open: number;
	time_close: string;
	time_open: string;
	volume: number;
}

function Price({ coinId }: ChartProps) {
	const { isLoading, data } = useQuery<IHistory[]>(["price", coinId], () =>
		fetchCoinHistory(coinId)
	);
	const [date, setDate] = useState<string>("");
	const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setDate(event.currentTarget.value);
	};

	return (
		<>
			{isLoading ? (
				"Loading Data..."
			) : (
				<>
					<PriceBoard>
						<SelecBox>
							<span>Choose Date</span>
							<SelectDate
								onChange={onChange}
								defaultValue="default"
							>
								<option value="default" disabled>
									Select
								</option>
								{data?.map((price) => (
									<option
										value={price.time_close}
										key={price.time_close}
									>
										{price.time_close.slice(5, 10)}
									</option>
								))}
							</SelectDate>
						</SelecBox>

						<Overview>
							<OverviewItem>
								<span>High</span>
								<span>
									${" "}
									{data
										?.find(
											(price) => price.time_close === date
										)
										?.high.toFixed(2)}
								</span>
							</OverviewItem>
							<OverviewItem>
								<span>Low</span>
								<span>
									${" "}
									{data
										?.find(
											(price) => price.time_close === date
										)
										?.low.toFixed(2)}
								</span>
							</OverviewItem>
						</Overview>
						<Overview>
							<OverviewItem>
								<span>Open</span>
								<span>
									${" "}
									{data
										?.find(
											(price) => price.time_close === date
										)
										?.open.toFixed(2)}
								</span>
							</OverviewItem>
							<OverviewItem>
								<span>Close</span>
								<span>
									${" "}
									{data
										?.find(
											(price) => price.time_close === date
										)
										?.close.toFixed(2)}
								</span>
							</OverviewItem>
						</Overview>
					</PriceBoard>
				</>
			)}
		</>
	);
}

export default Price;
