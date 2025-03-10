import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import Timer from "../components/Timer";
import * as Haptics from "expo-haptics";
import Icon from "react-native-vector-icons/Feather";
import { useClimberData } from "../contexts/ClimberDataContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

let gradePassFailMap = {};

let sessionKey: string;

const CurrentSessionScreen = () => {
	const [isFirstClimb, setIsFirstClimb] = useState(true);
	const [duration, setDuration] = useState(60);
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const [grade, setGrade] = useState<number | "INTRO">("INTRO");
	const [nextGrade, setNextGrade] = useState<{
		grade: number | "INTRO";
		sent: boolean;
	}>();
	const [isTimerShowing, setIsTimerShowing] = useState(false);
	const [hasSessionStarted, setHasSessionStarted] = useState(false);

	const { addSessionData, climberData } = useClimberData();

	useEffect(() => {
		Font.loadAsync({
			Rockledge: require("../../assets/fonts/Rockledge-9YYWB.otf")
		}).then(() => setFontsLoaded(true));
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
								onPress={async () => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium
									);

									addSessionData(
										sessionKey,
										gradePassFailMap
									);
									gradePassFailMap = {};

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
							<Text
								style={[
									styles.text,
									{ fontSize: 64 },
									{
										color:
											grade === nextGrade?.grade
												? nextGrade.sent
													? "#88B04B"
													: "#C75643"
												: "#F5F5F5"
									}
								]}
							>
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

									if (
										typeof grade === "number" &&
										grade - 1 >= 0
									) {
										setNextGrade({
											grade: grade - 1,
											sent: false
										});
									} else if (
										typeof grade === "number" &&
										grade - 1 === -1
									) {
										setNextGrade({
											grade: "INTRO",
											sent: false
										});
									}

									gradePassFailMap[grade] = gradePassFailMap[
										grade
									] || { sent: 0, didNotSend: 0 };
									gradePassFailMap[grade]["didNotSend"]++;

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

									if (grade === "INTRO") {
										setNextGrade({ grade: 0, sent: true });
									} else if (typeof grade === "number") {
										setNextGrade({
											grade: grade + 1,
											sent: true
										});
									}

									gradePassFailMap[grade] = gradePassFailMap[
										grade
									] || { sent: 0, didNotSend: 0 };
									gradePassFailMap[grade]["sent"]++;

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
						sessionKey = new Date().toISOString();

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
