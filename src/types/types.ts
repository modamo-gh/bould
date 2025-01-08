import { Dispatch, ReactNode, SetStateAction } from "react";

type Grade = `${number}`;

export type ClimberData = {
	[sessionDate: string]: {
		[grade: Grade]: SessionData;
	};
};

export type ClimberDataProviderProps = {
	children: ReactNode;
};

export type SessionData = {
	didNotSend: number;
	sent: number;
};

export type TimerProps = {
	duration: number;
	setIsTimerShowing: Dispatch<SetStateAction<Boolean>>;
};
