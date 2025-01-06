import {
	Dimensions,
	FlatList,
	SafeAreaView,
	ScrollView,
	Text,
	View
} from "react-native";
import { useClimberData } from "../contexts/ClimberDataContext";
import { BarGroup, CartesianChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import rockledge from "../../assets/fonts/Rockledge-9YYWB.otf";

const PastSessionsScreen = () => {
	const screenWidth = Dimensions.get("screen").width;
	const screenHeight = Dimensions.get("screen").height;

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: "green"
			}}
		>
			<FlatList
				data={[
					"red",
					"orange",
					"yellow",
					"green",
					"blue",
					"indigo",
					"violet"
				]}
				keyExtractor={({ item, index }) => index}
				horizontal
				pagingEnabled
				decelerationRate={"fast"}
				bounces
				snapToAlignment="center"
				contentContainerStyle={{ flexGrow: 1 }}
				renderItem={({ item }) => (
					<View
						style={{
							backgroundColor: item,
							height: screenHeight,
							width: screenWidth
						}}
					></View>
				)}
			/>
		</View>
	);
	// const { climberData } = useClimberData();

	// console.log(climberData);

	// const formattedData = Object.keys(climberData || {}).flatMap((session) =>
	// 	Object.keys(climberData[session]).map((grade) => ({
	// 		grade,
	// 		attempts:
	// 			climberData[session][grade]["sent"] +
	// 			climberData[session][grade]["didNotSend"],
	// 		sends: climberData[session][grade]["sent"]
	// 	}))
	// );

	// const stats = {
	// 	totalAttempts: 0,
	// 	totalSuccessfulAttempts: 0,
	// 	cumulativeGrade: 0,
	// 	cumulativeSentGrade: 0,
	// 	modeAttempt: [],
	// 	modeSends: [],
	// 	highestNumberOfAttempts: 0,
	// 	highestNumberOfSends: 0,
	// 	lowerMedianIndex: 0,
	// 	upperMedianIndex: 0,
	// 	lowerSentMedianIndex: 0,
	// 	upperSentMedianIndex: 0,
	// 	attemptMedians: new Set<number>(),
	// 	sentMedians: new Set<number>()
	// };

	// formattedData.forEach((datum) => {
	// 	stats.cumulativeGrade += datum.grade * datum.attempts;
	// 	stats.cumulativeSentGrade += datum.grade * datum.sends;
	// 	stats.totalAttempts += datum.attempts;
	// 	stats.totalSuccessfulAttempts += datum.sends;

	// 	if (datum.attempts >= stats.highestNumberOfAttempts) {
	// 		stats.highestNumberOfAttempts = datum.attempts;
	// 	}

	// 	if (datum.sends >= stats.highestNumberOfSends) {
	// 		stats.highestNumberOfSends = datum.sends;
	// 	}
	// });

	// stats.lowerMedianIndex = Math.floor((stats.totalAttempts - 1) / 2);
	// stats.upperMedianIndex = Math.ceil((stats.totalAttempts - 1) / 2);

	// let currentIndex = 0;

	// for (const datum of formattedData) {
	// 	currentIndex += datum.attempts;

	// 	if (currentIndex >= stats.lowerMedianIndex) {
	// 		stats.attemptMedians.add(datum.grade);
	// 		currentIndex = 0;
	// 		break;
	// 	}
	// }

	// for (const datum of formattedData) {
	// 	currentIndex += datum.attempts;

	// 	if (currentIndex >= stats.upperMedianIndex) {
	// 		stats.attemptMedians.add(datum.grade);
	// 		currentIndex = 0;
	// 		break;
	// 	}
	// }

	// stats.lowerSentMedianIndex = Math.floor(
	// 	(stats.totalSuccessfulAttempts - 1) / 2
	// );
	// stats.upperSentMedianIndex = Math.ceil(
	// 	(stats.totalSuccessfulAttempts - 1) / 2
	// );

	// for (const datum of formattedData) {
	// 	currentIndex += datum.sends;

	// 	if (currentIndex >= stats.lowerSentMedianIndex) {
	// 		stats.sentMedians.add(datum.grade);
	// 		currentIndex = 0;
	// 		break;
	// 	}
	// }

	// for (const datum of formattedData) {
	// 	currentIndex += datum.sends;

	// 	if (currentIndex >= stats.upperSentMedianIndex) {
	// 		stats.sentMedians.add(datum.grade);
	// 		currentIndex = 0;
	// 		break;
	// 	}
	// }

	// stats.modeAttempt = formattedData
	// 	.filter((datum) => datum.attempts === stats.highestNumberOfAttempts)
	// 	.map((datum) => datum.grade);

	// stats.modeSends = formattedData
	// 	.filter((datum) => datum.sends === stats.highestNumberOfSends)
	// 	.map((datum) => datum.grade);

	// console.log(stats);

	// const font = useFont(rockledge, 12);

	// const screenHeight = Dimensions.get("window").height;

	// return (
	// 	<SafeAreaView style={{ flex: 1, backgroundColor: "#B2BEB5" }}>
	// 		{formattedData.length ? (
	// 			<ScrollView style={{ flex: 1 }}>
	// 				<View style={{ height: 0.65 * screenHeight, padding: 16 }}>
	// 					<CartesianChart
	// 						xAxis={{ font }}
	// 						data={formattedData}
	// 						domainPadding={{ left: 50, right: 50 }}
	// 						xKey={"grade"}
	// 						yKeys={["sends", "attempts"]}
	// 					>
	// 						{({ points, chartBounds }) => (
	// 							<BarGroup
	// 								chartBounds={chartBounds}
	// 								betweenGroupPadding={0.3}
	// 								withinGroupPadding={0.1}
	// 								roundedCorners={{ topLeft: 5, topRight: 5 }}
	// 							>
	// 								<BarGroup.Bar
	// 									points={points.sends}
	// 									color="green"
	// 								/>
	// 								<BarGroup.Bar
	// 									points={points.attempts}
	// 									color="red"
	// 								/>
	// 							</BarGroup>
	// 						)}
	// 					</CartesianChart>
	// 				</View>
	// 				<Text>
	// 					{`You attempted ${stats.totalAttempts} climbs during this timeframe`}
	// 				</Text>
	// 				<Text>
	// 					{`You sent ${
	// 						stats.totalSuccessfulAttempts
	// 					} climbs during this timeframe for a success rate of ${(
	// 						(100 * stats.totalSuccessfulAttempts) /
	// 						stats.totalAttempts
	// 					).toFixed(2)}%`}
	// 				</Text>
	// 				<Text>{`Your mean grade was ${(
	// 					stats.cumulativeGrade / stats.totalAttempts
	// 				).toFixed(2)}, so let's call that about a ${Math.round(
	// 					stats.cumulativeGrade / stats.totalAttempts
	// 				)}`}</Text>
	// 				<Text>{`Your mean sent grade was ${(
	// 					stats.cumulativeSentGrade /
	// 					stats.totalSuccessfulAttempts
	// 				).toFixed(2)}, so let's call that about a ${Math.round(
	// 					stats.cumulativeSentGrade /
	// 						stats.totalSuccessfulAttempts
	// 				)}`}</Text>
	// 				<Text>{`Your mode attempted grade(s) was/were ${stats.modeAttempt.join(
	// 					", "
	// 				)}`}</Text>
	// 				<Text>{`Your mode sent grade(s) was/were ${stats.modeSends.join(
	// 					", "
	// 				)}`}</Text>
	// 				<Text>{`Your median attempted grade(s) was/were ${[
	// 					...stats.attemptMedians
	// 				].reduce((p, c) => p + c, 0) / [
	// 					...stats.attemptMedians
	// 				].length}`}</Text>
	// 				<Text>{`Your median sent grade(s) was/were ${[
	// 					...stats.sentMedians
	// 				].reduce((p, c) => p + c, 0) / [
	// 					...stats.sentMedians
	// 				].length}`}</Text>
	// 			</ScrollView>
	// 		) : null}
	// 	</SafeAreaView>
	// );
};

export default PastSessionsScreen;
