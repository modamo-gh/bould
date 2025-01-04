import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

const ClimberDataContext = createContext({});

export const ClimberDataProvider = ({ children }) => {
    const [climberData, setClimberData] = useState();

    useEffect(() => {
        (async () => {
            try {
                let storedClimberData = await AsyncStorage.getItem(
                    "climberData"
                );

                storedClimberData = JSON.parse(storedClimberData) || {};

                setClimberData(storedClimberData);
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

        console.log(date, sessionData, newClimberData)
    };

    return (
        <ClimberDataContext.Provider value={{ addSessionData, climberData }}>
            {children}
        </ClimberDataContext.Provider>
    );
};

export const useClimberData = () => useContext(ClimberDataContext);
