import { LinearGradient } from "expo-linear-gradient";
import {
	Image,
	ImageBackground,
	SafeAreaView,
	StyleSheet,
	View
} from "react-native";

const HomeScreen = () => {
	return (
		<View style={{ backgroundColor: "#F4EBDC", flex: 1 }}>
			<ImageBackground
				resizeMode="center"
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
					colors={["rgba(244, 235, 220, 0)", "rgba(244, 235, 220, 1)"]}
                    style={{flex: 1, alignItems: "center", width: "100%"}}
                    start={{x: 0, y: 0}}
                    end={{x: 0, y: 1}}
				/>
			</ImageBackground>
			<View style={{ flex: 1 }}></View>
		</View>
	);
};

const styles = StyleSheet.create({
	absoluteFill: { ...StyleSheet.absoluteFillObject }
});

export default HomeScreen;
