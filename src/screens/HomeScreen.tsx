import { LinearGradient } from "expo-linear-gradient";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { useFonts } from "expo-font";

const HomeScreen = () => {
	const [loaded, error] = useFonts({
		Rockledge: require("../../assets/fonts/Rockledge-9YYWB.otf")
	});

	if (!loaded && !error) {
		return null;
	}

	return (
		<View style={{ backgroundColor: "#F4EBDC", flex: 1 }}>
			<ImageBackground
				resizeMode="cover"
				source={require("../../assets/climber.png")}
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flex: 1
				}}
			>
				<View style={{ flex: 4 }}></View>
				<LinearGradient
					colors={[
						"rgba(244, 235, 220, 0)",
						"rgba(244, 235, 220, 1)"
					]}
					style={{ flex: 1, alignItems: "center", width: "100%" }}
					start={{ x: 0, y: 0 }}
					end={{ x: 0, y: 1 }}
				/>
			</ImageBackground>
			<View
				style={{
					display: "flex",
					flex: 1,
					gap: 18,
					justifyContent: "flex-end",
					padding: 20
				}}
			>
				<View
					style={{
						alignItems: "center",
						backgroundColor: "#D62400",
						borderRadius: 16,
						display: "flex",
						height: 85,
						justifyContent: "center",
						width: "100%"
					}}
				>
					<Text
						style={{
							color: "#F4ECDD",
							fontFamily: "Rockledge",
							fontSize: 44,
						}}
					>
						START SESSION
					</Text>
				</View>
				<View
					style={{
						alignItems: "center",
						backgroundColor: "#502314",
						borderRadius: 16,
						display: "flex",
						height: 85,
						justifyContent: "center",
						width: "100%"
					}}
				><Text
					style={{
						color: "#F4ECDD",
						fontFamily: "Rockledge",
						fontSize: 44,
					}}
				>
						PAST STATS
					</Text></View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	absoluteFill: { ...StyleSheet.absoluteFillObject }
});

export default HomeScreen;
