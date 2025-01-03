import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import Timer from "../components/Timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/Feather";

const gradePassFailMap = new Map<
	number | "INTRO",
	{ send: number; didNotSend: number }
>();

let data;

const CurrentSessionScreen = () => {
	const [isFirstClimb, setIsFirstClimb] = useState(true);
	const [duration, setDuration] = useState(120);
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const [grade, setGrade] = useState<number | "INTRO">("INTRO");
	const [isTimerShowing, setIsTimerShowing] = useState(false);
	const [hasSessionStarted, setHasSessionStarted] = useState(false);

	useEffect(() => {
		Font.loadAsync({
			Rockledge: require("../../assets/fonts/Rockledge-9YYWB.otf")
		}).then(() => setFontsLoaded(true));

		const loadData = async () => {
			const d = await AsyncStorage.getItem("zzzzzz");

			if (d) {
				return d;
			} else {
				return {};
			}
		};

		data = loadData();
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	const onButtonPress = ({ pressed }) => [
		{
			alignItems: "center",
			justifyContent: "center",
			opacity: pressed ? 0.6 : 1
		}
	];

	return (
		<SafeAreaView style={styles.container}>
			{hasSessionStarted ? (
				!isTimerShowing ? (
					<>
						<View
							style={{
								flex: 1,
								maxHeight: 48,
								width: "100%",
								justifyContent: "flex-end",
								flexDirection: "row",
								padding: 8
							}}
						>
							<View style={{ flex: 1 }}></View>
							<Pressable
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium
									);
									setHasSessionStarted(false);
								}}
								style={[
									onButtonPress,
									{
										justifyContent: "center",
										alignContent: "center"
									}
								]}
							>
								<Icon
									name="x-circle"
									color="#F5F5F5"
									size={24}
									style={{
										textAlign: "center",
										paddingBottom: 8
									}}
								/>
								<Text style={[styles.text, { fontSize: 24 }]}>
									Stop Session
								</Text>
							</Pressable>
						</View>
						<View style={styles.counterContainer}>
							<Pressable
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium
									);

									if (grade === "INTRO") {
										setGrade(0);
									} else if (typeof grade === "number") {
										setGrade(grade + 1);
									}
								}}
								style={[
									onButtonPress,
									{
										maxHeight: 96,
										width: 96,
										flex: 1,
										justifyContent: "center"
									}
								]}
							>
								<Feather
									name="chevron-up"
									style={[styles.text, { fontSize: 64 }]}
								/>
							</Pressable>
							<Text style={[styles.text, { fontSize: 64 }]}>
								V{grade}
							</Text>
							<Pressable
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium
									);

									if (
										typeof grade === "number" &&
										grade - 1 >= 0
									) {
										setGrade(grade - 1);
									} else if (
										typeof grade === "number" &&
										grade - 1 === -1
									) {
										setGrade("INTRO");
									}
								}}
								style={[
									onButtonPress,
									{
										maxHeight: 96,
										width: 96,
										flex: 1,
										justifyContent: "center"
									}
								]}
							>
								<Feather
									name="chevron-down"
									style={[
										styles.text,
										{
											fontSize: 64
										}
									]}
								/>
							</Pressable>
						</View>
						<View style={styles.buttonContainer}>
							<Pressable
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium
									);

									if (isFirstClimb) {
										setIsFirstClimb(false);
									} else if (duration + 60 <= 180) {
										setDuration(duration + 60);
									}

									const stats = gradePassFailMap.get(
										grade
									) || {
										send: 0,
										didNotSend: 0
									};

									stats.didNotSend = stats.didNotSend + 1;
									gradePassFailMap.set(grade, stats);

									console.log(gradePassFailMap);

									setIsTimerShowing(!isTimerShowing);
								}}
								style={[
									styles.button,
									{ backgroundColor: "#C75643" }
								]}
							>
								<Text style={[styles.text, { fontSize: 32 }]}>
									DID NOT SEND
								</Text>
							</Pressable>
							<Pressable
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium
									);

									if (isFirstClimb) {
										setIsFirstClimb(false);
									} else if (duration - 60 >= 60) {
										setDuration(duration - 60);
									}

									const stats = gradePassFailMap.get(
										grade
									) || {
										send: 0,
										didNotSend: 0
									};

									stats.send = stats.send + 1;
									gradePassFailMap.set(grade, stats);

									console.log(gradePassFailMap);

									setIsTimerShowing(!isTimerShowing);
								}}
								style={[
									styles.button,
									{ backgroundColor: "#88B04B" }
								]}
							>
								<Text style={[styles.text, { fontSize: 64 }]}>
									SENT
								</Text>
							</Pressable>
						</View>
					</>
				) : (
					<Timer
						duration={duration}
						setIsTimerShowing={setIsTimerShowing}
					/>
				)
			) : (
				<Pressable
					onPress={() => {
						setHasSessionStarted(true);
						Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
					}}
					style={onButtonPress}
				>
					<Text style={[styles.text, { fontSize: 64 }]}>
						Start Session
					</Text>
				</Pressable>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 5,
		height: 72,
		justifyContent: "center",
		width: 144
	},
	buttonContainer: {
		alignItems: "center",
		justifyContent: "space-around",
		flex: 1,
		flexDirection: "row",
		height: 72,
		width: "100%"
	},
	container: {
		alignItems: "center",
		backgroundColor: "#B2BEB5",
		flex: 1,
		justifyContent: "center"
	},
	counterContainer: {
		alignItems: "center",
		flex: 4,
		justifyContent: "center",
		width: "100%"
	},
	text: {
		color: "#F5F5F5",
		fontFamily: "Rockledge",
		textAlign: "center"
	}
});

export default CurrentSessionScreen;
