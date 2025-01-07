import { Dispatch, SetStateAction } from "react";

export type TimerProps = {
	duration: number;
	setIsTimerShowing: Dispatch<SetStateAction<Boolean>>;
};
