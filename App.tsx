import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Font from "expo-font";
import Timer from "./src/components/Timer";

const App = () => {
	const [isFirstClimb, setIsFirstClimb] = useState(true);
	const [duration, setDuration] = useState(120);
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const [grade, setGrade] = useState<number | "INTRO">("INTRO");
	const [isTimerShowing, setIsTimerShowing] = useState(false);

	useEffect(() => {
		Font.loadAsync({
			Rockledge: require("../bould/assets/fonts/Rockledge-9YYWB.otf")
		}).then(() => setFontsLoaded(true));
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	const onButtonPress = ({ pressed }) => [
		{
			alignItems: "center",
			height: 96,
			justifyContent: "center",
			opacity: pressed ? 0.6 : 1,
			width: 96
		}
	];

	return (
		<SafeAreaView style={styles.container}>
			{!isTimerShowing ? (
				<>
					<View style={styles.counterContainer}>
						<Pressable
							onPress={() => {
								if (grade === "INTRO") {
									setGrade(0);
								} else if (typeof grade === "number") {
									setGrade(grade + 1);
								}
							}}
							style={onButtonPress}
						>
							<Feather name="chevron-up" style={[styles.text]} />
						</Pressable>
						<Text style={styles.text}>V{grade}</Text>
						<Pressable
							onPress={() => {
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
							style={onButtonPress}
						>
							<Feather name="chevron-down" style={styles.text} />
						</Pressable>
					</View>
					<View style={styles.buttonContainer}>
						<Pressable
							onPress={() => {
								if (isFirstClimb) {
									setIsFirstClimb(false);
								} else if (duration + 60 <= 180) {
									setDuration(duration + 60);
								}

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
								if (isFirstClimb) {
									setIsFirstClimb(false);
								} else if (duration - 60 >= 60) {
									setDuration(duration - 60);
								}
								setIsTimerShowing(!isTimerShowing);
							}}
							style={[
								styles.button,
								{ backgroundColor: "#88B04B" }
							]}
						>
							<Text style={styles.text}>SENT</Text>
						</Pressable>
					</View>
				</>
			) : (
				<Timer
					duration={duration}
					setIsTimerShowing={setIsTimerShowing}
				/>
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
		fontSize: 64,
		textAlign: "center"
	}
});

export default App;
