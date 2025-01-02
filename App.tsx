import { Pressable, SafeAreaView, StyleSheet, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import * as Font from "expo-font";

const App = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false);
	const [grade, setGrade] = useState<number | "INTRO">(0);

	useEffect(() => {
		Font.loadAsync({
			Rockledge: require("../bould/assets/fonts/Rockledge-9YYWB.otf")
		}).then(() => setFontsLoaded(true));
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<SafeAreaView
			style={{
				alignItems: "center",
				backgroundColor: "#B2BEB5",
				flex: 1,
				justifyContent: "center"
			}}
		>
			<Pressable
				onPress={() => {
					if (grade === "INTRO") {
						setGrade(0);
					} else if (typeof grade === "number") {
						setGrade(grade + 1);
					}
				}}
				style={({ pressed }) => [
					{
						alignItems: "center",
						height: 96,
						justifyContent: "center",
						opacity: pressed ? 0.6 : 1,
						width: 96
					}
				]}
			>
				<Feather name="chevron-up" style={[styles.text]} />
			</Pressable>
			<Text style={styles.text}>V{grade}</Text>
			<Pressable
				onPress={() => {
					if (typeof grade === "number" && grade - 1 >= 0) {
						setGrade(grade - 1);
					} else if (typeof grade === "number" && grade - 1 === -1) {
						setGrade("INTRO");
					}
				}}
				style={({ pressed }) => [
					{
						alignItems: "center",
						height: 96,
						justifyContent: "center",
						opacity: pressed ? 0.6 : 1,
						width: 96
					}
				]}
			>
				<Feather name="chevron-down" style={styles.text} />
			</Pressable>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	text: {
		color: "#F5F5F5",
		fontFamily: "Rockledge",
		fontSize: 64,
		textAlign: "center"
	}
});

export default App;
