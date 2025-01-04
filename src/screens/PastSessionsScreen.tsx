import { SafeAreaView, Text } from "react-native";
import { useClimberData } from "../contexts/ClimberDataContext";

const PastSessionsScreen = () => {
	const { climberData } = useClimberData();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "#B2BEB5" }}>
			<Text>{JSON.stringify(climberData)}</Text>
		</SafeAreaView>
	);
};

export default PastSessionsScreen;
