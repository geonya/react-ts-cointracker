import ApexChart from "react-apexcharts";
import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { fetchCoinHistory } from "../api";
import { isDarkAtom } from "../atom";

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

function Chart({ coinId }: ChartProps) {
	const isDark = useRecoilValue(isDarkAtom);
	const { isLoading, data } = useQuery<IHistory[]>(["ohlcv", coinId], () =>
		fetchCoinHistory(coinId)
	);
	return (
		<>
			{isLoading ? (
				"Loading Chart..."
			) : (
				<ApexChart
					type="candlestick"
					series={[
						{
							name: "Price",
							data: data?.map((price) => ({
								x: price.time_close,
								y: [
									price.open.toFixed(2),
									price.high.toFixed(2),
									price.low.toFixed(2),
									price.close.toFixed(2),
								],
							})),
						},
					]}
					options={{
						chart: {
							width: 500,
							height: 350,
							toolbar: { show: false },
							background: "transparent",
						},
						theme: {
							mode: isDark ? "dark" : "light",
						},

						xaxis: {
							type: "datetime",
							categories: data?.map((price) => price.time_close),
						},
						yaxis: {
							labels: {
								formatter: (value) => "$ " + value,
							},
						},
					}}
				></ApexChart>
			)}
		</>
	);
}

export default Chart;
