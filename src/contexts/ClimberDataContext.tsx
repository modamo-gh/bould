import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState
} from "react";
import { ClimberData, ClimberDataProviderProps } from "../types/types";

const ClimberDataContext = createContext({});

export const ClimberDataProvider: React.FC<ClimberDataProviderProps> = ({
	children
}) => {
	const [climberData, setClimberData] = useState<ClimberData>();

	useEffect(() => {
		(async () => {
			try {
				const storedClimberData: string | null =
					await AsyncStorage.getItem("climberData");
				const parsedData: ClimberData = storedClimberData
					? JSON.parse(storedClimberData)
					: {};

				setClimberData(parsedData);
			} catch (error) {
				console.log("Error retrieving data", error);
			}
		})();
	}, []);

	const addSessionData = async (date, sessionData) => {
		const newClimberData = { ...climberData };

		newClimberData[date] = sessionData;

		setClimberData(newClimberData);

		await AsyncStorage.setItem(
			"climberData",
			JSON.stringify(newClimberData)
		);

		console.log(date, sessionData, newClimberData);
	};

	return (
		<ClimberDataContext.Provider value={{ addSessionData, climberData }}>
			{children}
		</ClimberDataContext.Provider>
	);
};

export const useClimberData = () => useContext(ClimberDataContext);
