import {
	Dimensions,
	FlatList,
	Pressable,
	SafeAreaView,
	ScrollView,
	Text,
	View
} from "react-native";
import { useClimberData } from "../contexts/ClimberDataContext";
import { BarGroup, CartesianChart } from "victory-native";
import { useFont } from "@shopify/react-native-skia";
import rockledge from "../../assets/fonts/Rockledge-9YYWB.otf";
import { DateTime, Duration } from "luxon";
import { useState } from "react";

const PastSessionsScreen = () => {
	const [safeAreaHeight, setSafeAreaHeight] = useState(0);
	const [isAttemptsExpanded, setIsAttemptsExpanded] = useState(false);
	const [isSentsExpanded, setIsSentsExpanded] = useState(false);
	const [isRecommendationsExpanded, setIsRecommendationssExpanded] =
		useState(false);

	const { climberData } = useClimberData();

	const font = useFont(rockledge, 12);

	const screenWidth = Dimensions.get("window").width;
	const screenHeight = Dimensions.get("window").height;

	const now = DateTime.now();

	const oldestDate = DateTime.fromISO(
		Object.keys({ ...climberData }).sort()[0]
	);

	const timeIntervals = [];

	const generateIntervals = (timeUnit: string, maxOfUnit: number) => {
		const timeObject: { [key: string]: number } = {};

		timeObject[timeUnit] = 1;

		while (
			now.minus(timeObject) >= oldestDate &&
			timeObject[timeUnit] < maxOfUnit
		) {
			timeIntervals.push({
				timeUnit: timeUnit,
				number: timeObject[timeUnit]
			});

			timeObject[timeUnit] *= 2;
		}
	};

	generateIntervals("days", 7);
	generateIntervals("weeks", 4);
	generateIntervals("months", 12);
	generateIntervals("years", Infinity);

	timeIntervals.push({
		timeUnit: "days",
		number: Infinity
	});

	return (
		<SafeAreaView
			style={{
				flex: 1
			}}
		>
			<FlatList
				data={timeIntervals}
				keyExtractor={({ item, index }) => index}
				horizontal
				pagingEnabled
				decelerationRate={"fast"}
				bounces
				snapToAlignment="center"
				contentContainerStyle={{ flexGrow: 1 }}
				renderItem={({ item, index }) => {
					const { timeUnit, number } = item;
					const n = DateTime.now();
					const t = {};
					t[timeUnit] = number;

					const startDate = Number.isFinite(number)
						? n.minus(Duration.fromObject(t))
						: oldestDate;

					const formattedData = Object.keys(climberData || {})
						.filter(
							(sessionDate) =>
								DateTime.fromISO(sessionDate) >= startDate &&
								DateTime.fromISO(sessionDate) <= n
						)
						.flatMap((session) =>
							Object.keys(climberData[session]).map((grade) => ({
								grade,
								attempts:
									climberData[session][grade]["sent"] +
									climberData[session][grade]["didNotSend"],
								sends: climberData[session][grade]["sent"]
							}))
						);

					const stats = {
						totalAttempts: 0,
						totalSuccessfulAttempts: 0,
						cumulativeGrade: 0,
						cumulativeSentGrade: 0,
						modeAttempt: [],
						modeSends: [],
						highestNumberOfAttempts: 0,
						highestNumberOfSends: 0,
						lowerMedianIndex: 0,
						upperMedianIndex: 0,
						lowerSentMedianIndex: 0,
						upperSentMedianIndex: 0,
						attemptMedians: new Set<number>(),
						sentMedians: new Set<number>()
					};

					formattedData.forEach((datum) => {
						stats.cumulativeGrade += datum.grade * datum.attempts;
						stats.cumulativeSentGrade += datum.grade * datum.sends;
						stats.totalAttempts += datum.attempts;
						stats.totalSuccessfulAttempts += datum.sends;

						if (datum.attempts >= stats.highestNumberOfAttempts) {
							stats.highestNumberOfAttempts = datum.attempts;
						}

						if (datum.sends >= stats.highestNumberOfSends) {
							stats.highestNumberOfSends = datum.sends;
						}
					});

					stats.lowerMedianIndex = Math.floor(
						(stats.totalAttempts - 1) / 2
					);
					stats.upperMedianIndex = Math.ceil(
						(stats.totalAttempts - 1) / 2
					);

					let currentIndex = 0;

					for (const datum of formattedData) {
						currentIndex += datum.attempts;

						if (currentIndex >= stats.lowerMedianIndex) {
							stats.attemptMedians.add(datum.grade);
							currentIndex = 0;
							break;
						}
					}

					for (const datum of formattedData) {
						currentIndex += datum.attempts;

						if (currentIndex >= stats.upperMedianIndex) {
							stats.attemptMedians.add(datum.grade);
							currentIndex = 0;
							break;
						}
					}

					stats.lowerSentMedianIndex = Math.floor(
						(stats.totalSuccessfulAttempts - 1) / 2
					);
					stats.upperSentMedianIndex = Math.ceil(
						(stats.totalSuccessfulAttempts - 1) / 2
					);

					for (const datum of formattedData) {
						currentIndex += datum.sends;

						if (currentIndex >= stats.lowerSentMedianIndex) {
							stats.sentMedians.add(datum.grade);
							currentIndex = 0;
							break;
						}
					}

					for (const datum of formattedData) {
						currentIndex += datum.sends;

						if (currentIndex >= stats.upperSentMedianIndex) {
							stats.sentMedians.add(datum.grade);
							currentIndex = 0;
							break;
						}
					}

					stats.modeAttempt = formattedData
						.filter(
							(datum) =>
								datum.attempts === stats.highestNumberOfAttempts
						)
						.map((datum) => datum.grade);

					stats.modeSends = formattedData
						.filter(
							(datum) =>
								datum.sends === stats.highestNumberOfSends
						)
						.map((datum) => datum.grade);

					return (
						<View
							onLayout={(event) => {
								const { height } = event.nativeEvent.layout;
								setSafeAreaHeight(height);
							}}
							style={{ flex: 1, backgroundColor: "#B2BEB5" }}
						>
							{formattedData.length ? (
								<View style={{ flex: 1, width: screenWidth }}>
									<View
										style={{
											justifyContent: "center",
											alignItems: "center",
											height: 48
										}}
									>
										<Text
											style={{
												textAlign: "center",
												fontFamily: "Rockledge",
												fontSize: 24,
												color: "#F5F5F5"
											}}
										>
											{Number.isFinite(number)
												? `Past ${number} ${timeUnit}`
												: "All Time"}
										</Text>
									</View>
									<ScrollView
										bounces={false}
										style={{
											flex: 1
										}}
									>
										<View
											style={{
												flexGrow: 1,
												minHeight: safeAreaHeight - 208
											}}
										>
											<CartesianChart
												axisOptions={{
													font,
													formatXLabel: (grade) =>
														`V${grade}`,
													labelColor: "#F5F5F5"
												}}
												data={formattedData}
												padding={24}
												domainPadding={{
													left: 50,
													right: 50
												}}
												xKey={"grade"}
												yKeys={["attempts", "sends"]}
											>
												{({ points, chartBounds }) => (
													<BarGroup
														chartBounds={
															chartBounds
														}
														betweenGroupPadding={
															0.3
														}
														withinGroupPadding={0.1}
														roundedCorners={{
															topLeft: 5,
															topRight: 5
														}}
													>
														<BarGroup.Bar
															points={
																points.sends
															}
															color="#88B04B"
														/>
														<BarGroup.Bar
															points={
																points.attempts
															}
															color="#C75643"
														/>
													</BarGroup>
												)}
											</CartesianChart>
										</View>
										<Pressable
											onPress={() =>
												setIsAttemptsExpanded(
													!isAttemptsExpanded
												)
											}
											style={
												isAttemptsExpanded
													? {
															minHeight: 96,
															backgroundColor:
																"#5A5A5A",
															justifyContent:
																"center",
															padding: 8,
															borderRadius: 5,
															marginHorizontal: 8,
															marginBottom: 8
													  }
													: {
															minHeight: 48,
															backgroundColor:
																"#5A5A5A",
															justifyContent:
																"center",
															padding: 8,
															borderRadius: 5,
															marginHorizontal: 8,
															marginBottom: 8
													  }
											}
										>
											{!isAttemptsExpanded ? (
												<Text
													style={{
														color: "#F5F5F5",
														fontSize: 24,
														fontFamily: "Rockledge"
													}}
												>
													All Attempts
												</Text>
											) : (
												<>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>
														{`You attempted ${stats.totalAttempts} climbs during this timeframe`}
													</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Your mean grade was ${(
														stats.cumulativeGrade /
														stats.totalAttempts
													).toFixed(
														2
													)}, so let's call that about a ${Math.round(
														stats.cumulativeGrade /
															stats.totalAttempts
													)}`}</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Your mode attempted grade(s) was/were ${stats.modeAttempt.join(
														", "
													)}`}</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Your median attempted grade(s) was/were ${
														[
															...stats.attemptMedians
														].reduce(
															(p, c) => p + c,
															0
														) /
														[
															...stats.attemptMedians
														].length
													}`}</Text>
												</>
											)}
										</Pressable>
										<Pressable
											onPress={() =>
												setIsSentsExpanded(
													!isSentsExpanded
												)
											}
											style={
												isSentsExpanded
													? {
															minHeight: 96,
															backgroundColor:
																"#5A5A5A",
															justifyContent:
																"center",
															padding: 8,
															borderRadius: 5,
															marginHorizontal: 8,
															marginBottom: 8
													  }
													: {
															minHeight: 48,
															backgroundColor:
																"#5A5A5A",
															justifyContent:
																"center",
															padding: 8,
															borderRadius: 5,
															marginHorizontal: 8,
															marginBottom: 8
													  }
											}
										>
											{!isSentsExpanded ? (
												<Text
													style={{
														color: "#F5F5F5",
														fontSize: 24,
														fontFamily: "Rockledge"
													}}
												>
													All Sends
												</Text>
											) : (
												<>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>
														{`You sent ${
															stats.totalSuccessfulAttempts
														} climbs during this timeframe for a success rate of ${(
															(100 *
																stats.totalSuccessfulAttempts) /
															stats.totalAttempts
														).toFixed(2)}%`}
													</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Your mean sent grade was ${(
														stats.cumulativeSentGrade /
														stats.totalSuccessfulAttempts
													).toFixed(
														2
													)}, so let's call that about a ${Math.round(
														stats.cumulativeSentGrade /
															stats.totalSuccessfulAttempts
													)}`}</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Your mode sent grade(s) was/were ${stats.modeSends.join(
														", "
													)}`}</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Your median sent grade(s) was/were ${
														[
															...stats.sentMedians
														].reduce(
															(p, c) => p + c,
															0
														) /
														[...stats.sentMedians]
															.length
													}`}</Text>
												</>
											)}
										</Pressable>
										<Pressable
											onPress={() =>
												setIsRecommendationssExpanded(
													!isRecommendationsExpanded
												)
											}
											style={
												isRecommendationsExpanded
													? {
															minHeight: 96,
															backgroundColor:
																"#5A5A5A",
															justifyContent:
																"center",
															padding: 8,
															borderRadius: 5,
															marginHorizontal: 8
													  }
													: {
															minHeight: 48,
															backgroundColor:
																"#5A5A5A",
															justifyContent:
																"center",
															padding: 8,
															borderRadius: 5,
															marginHorizontal: 8
													  }
											}
										>
											{!isRecommendationsExpanded ? (
												<Text
													style={{
														color: "#F5F5F5",
														fontSize: 24,
														fontFamily: "Rockledge"
													}}
												>
													Recommendations
												</Text>
											) : (
												<>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`Based on the mean, median, and mode of your sends, your baseline grade is a V${Math.floor(
														(Number(
															stats.modeSends[0]
														) +
															Math.round(
																stats.cumulativeSentGrade /
																	stats.totalSuccessfulAttempts
															) +
															Number(
																[
																	...stats.sentMedians
																][0]
															)) /
															3
													)}`}</Text>
													<Text
														style={{
															color: "#F5F5F5",
															fontSize: 16,
															fontFamily:
																"Rockledge"
														}}
													>{`For your next session warmup, start with a V${Math.floor(
														Math.floor(
															(Number(
																stats
																	.modeSends[0]
															) +
																Math.round(
																	stats.cumulativeSentGrade /
																		stats.totalSuccessfulAttempts
																) +
																Number(
																	[
																		...stats.sentMedians
																	][0]
																)) /
																3
														) * 0.7
													)}`}</Text>
												</>
											)}
										</Pressable>
									</ScrollView>
								</View>
							) : null}
						</View>
					);
				}}
			/>
		</SafeAreaView>
	);
};

export default PastSessionsScreen;
