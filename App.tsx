import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PastSessionsScreen from "./src/screens/PastSessionsScreen";
import CurrentSessionScreen from "./src/screens/CurrentSessionScreen";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

const Tabs = createBottomTabNavigator({
	screens: {
		PastSessions: PastSessionsScreen,
		CurrentSession: CurrentSessionScreen
	}
});

const App = () => {
	return (
		<NavigationContainer>
			<Tabs.Navigator
				screenOptions={({ route }) => ({
					headerShown: false,
					tabBarActiveTintColor: "#F5F5F5",
					tabBarIcon: ({ color, size }) => {
						let iconName: string;

						switch (route.name) {
							case "Past Sessions":
								iconName = "clock";
								break;
							case "Current Session":
								iconName = "sun";
								break;
						}

						return (
							<Icon name={iconName} color={color} size={size} />
						);
					},
					tabBarStyle: {
						backgroundColor: "#B2BEB5",
						borderTopWidth: 0
					}
				})}
			>
				<Tabs.Screen
					name="Past Sessions"
					component={PastSessionsScreen}
				></Tabs.Screen>
				<Tabs.Screen
					name="Current Session"
					component={CurrentSessionScreen}
				></Tabs.Screen>
			</Tabs.Navigator>
		</NavigationContainer>
	);
};

export default App;
