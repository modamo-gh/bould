import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PastSessionsScreen from "./src/screens/PastSessionsScreen";
import CurrentSessionScreen from "./src/screens/CurrentSessionScreen";
import { NavigationContainer } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";
import { ClimberDataProvider } from "./src/contexts/ClimberDataContext";
import HomeScreen from "./src/screens/HomeScreen";

const Tabs = createBottomTabNavigator();

const App = () => {
	return (
		<ClimberDataProvider>
			<NavigationContainer>
				<Tabs.Navigator
					initialRouteName="Current Session"
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
								default:
									iconName = "alert-circle";
							}

							return (
								<Icon
									name={iconName}
									color={color}
									size={size}
								/>
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
						component={HomeScreen}
					></Tabs.Screen>
				</Tabs.Navigator>
			</NavigationContainer>
		</ClimberDataProvider>
	);
};

export default App;
