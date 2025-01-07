import { Dispatch, ReactNode, SetStateAction } from "react";

export type ClimberDataProviderProps = {
	children: ReactNode;
};

export type TimerProps = {
	duration: number;
	setIsTimerShowing: Dispatch<SetStateAction<Boolean>>;
};
