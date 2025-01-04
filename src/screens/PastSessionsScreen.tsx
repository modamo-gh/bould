import { Dimensions, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useClimberData } from "../contexts/ClimberDataContext";
import { BarGroup, CartesianChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import rockledge from "../../assets/fonts/Rockledge-9YYWB.otf";

const PastSessionsScreen = () => {
	const { climberData } = useClimberData();

	const formattedData = Object.keys(climberData || {}).flatMap((session) =>
		Object.keys(climberData[session]).map((grade) => ({
			grade,
			attempts:
				climberData[session][grade]["sent"] +
				climberData[session][grade]["didNotSend"],
			sends: climberData[session][grade]["sent"]
		}))
	);

	const stats = { totalAttempts: 0, totalSuccessfulAttempts: 0, cumulativeGrade: 0 };

	formattedData.forEach((datum) => {
		stats.cumulativeGrade += 0;
		stats.totalAttempts += datum.attempts;
		stats.totalSuccessfulAttempts += datum.sends;
	});

	const font = useFont(rockledge, 12);

	const screenHeight = Dimensions.get("window").height;

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#B2BEB5" }}>
			{formattedData.length ? (
				<ScrollView style={{ flex: 1 }}>
					<View style={{ height: 0.65 * screenHeight, padding: 16 }}>
						<CartesianChart
							xAxis={{ font }}
							data={formattedData}
							domainPadding={{ left: 50, right: 50 }}
							xKey={"grade"}
							yKeys={["sends", "attempts"]}
						>
							{({ points, chartBounds }) => (
								<BarGroup
									chartBounds={chartBounds}
									betweenGroupPadding={0.3}
									withinGroupPadding={0.1}
									roundedCorners={{ topLeft: 5, topRight: 5 }}
								>
									<BarGroup.Bar
										points={points.sends}
										color="green"
									/>
									<BarGroup.Bar
										points={points.attempts}
										color="red"
									/>
								</BarGroup>
							)}
						</CartesianChart>
					</View>
					<Text>
						{`You attempted ${stats.totalAttempts} climbs during this timeframe`}
					</Text>
					<Text>
						{`You sent ${
							stats.totalSuccessfulAttempts
						} climbs during this timeframe for a success rate of ${(
							(100 * stats.totalSuccessfulAttempts) /
							stats.totalAttempts
						).toFixed(2)}%`}
					</Text>
					<Text>Your mean grade was</Text>
				</ScrollView>
			) : null}
		</SafeAreaView>
	);
};

export default PastSessionsScreen;
