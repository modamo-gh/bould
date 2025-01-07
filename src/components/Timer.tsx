import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
	interpolate,
	useAnimatedProps,
	useSharedValue,
	withTiming
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { TimerProps } from "../types/types";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Timer: React.FC<TimerProps> = ({ duration, setIsTimerShowing }) => {
	const radius = 150;
	const circumference = 2 * Math.PI * radius;

	const progress = useSharedValue(1);

	const red = useSharedValue(199);
	const green = useSharedValue(86);
	const blue = useSharedValue(67);

	const [remainingTime, setRemainingTime] = useState(duration);
	const [textSize, setTextSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const interval = setInterval(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			setRemainingTime((prev) => {
				if (prev <= 1) {
					clearInterval(interval);
					progress.value = withTiming(0, { duration: 500 });

					setIsTimerShowing(false);
					return 0;
				}

				const newRemainingTime = prev - 1;

				progress.value = withTiming(newRemainingTime / duration, {
					duration: 1000
				});

				red.value = withTiming(
					interpolate(progress.value, [1, 0], [199, 136])
				);
				green.value = withTiming(
					interpolate(progress.value, [1, 0], [86, 176])
				);
				blue.value = withTiming(
					interpolate(progress.value, [1, 0], [67, 75])
				);

				return newRemainingTime;
			});
		}, 1000);

		return () => clearInterval(interval);
	}, [duration, progress, red, green, blue]);

	const animatedProps = useAnimatedProps(() => ({
		strokeDashoffset: circumference * progress.value,
		stroke: `rgb(${Math.round(red.value)}, ${Math.round(
			green.value
		)}, ${Math.round(blue.value)})`
	}));
	return (
		<View
			style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
		>
			<View style={{ position: "relative", height: 500, width: 500 }}>
				<Svg height={500} width={500}>
					<AnimatedCircle
						animatedProps={animatedProps}
						cx={250}
						cy={250}
						r={radius}
						strokeDasharray={`${circumference} ${circumference}`}
						strokeLinecap="round"
						strokeWidth={10}
						fill="#B2BEB5"
						transform={`rotate(-90 250 250)`}
					/>
				</Svg>
				<Text
					style={{
						color: "#F5F5F5",
						fontFamily: "Rockledge",
						fontSize: 64,
						left: "50%",
						position: "absolute",
						top: "50%",
						transform: [
							{ translateX: -textSize.width / 2 },
							{ translateY: -textSize.height / 2 }
						]
					}}
					onLayout={(event) => {
						const { width, height } = event.nativeEvent.layout;
						setTextSize({ width, height });
					}}
				>
					{remainingTime}
				</Text>
			</View>
		</View>
	);
};

export default Timer;
