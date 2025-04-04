import { Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/styles";
import * as Haptics from 'expo-haptics';

function Button({
	children,
	onPress,
	disabled = false,
	btnStyles,
	textStyles
}) {

	const handlePress = ()=> {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		onPress()
	}
	return (
		<Pressable
			style={({ pressed }) => [
				styles.button,
				btnStyles,
				pressed && styles.pressed,
				disabled && styles.disabled
			]}
			onPress={handlePress}
			disabled={disabled}
		>
			<View>
				<Text style={[styles.buttonText, textStyles]}>{children}</Text>
			</View>
		</Pressable>
	);
}

export default Button;

const styles = StyleSheet.create({
	button: {
		borderRadius: 8,
		marginHorizontal: 20,
		height: 39,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 6,
		paddingHorizontal: 12,
		backgroundColor: Colors.succes[400],
		elevation: 2,
		shadowColor: "black",
		shadowOffset: { width: 1, height: 1 },
		shadowOpacity: 0.25,
		shadowRadius: 4
	},
	disabled: {
		opacity: 0.7
	},
	pressed: {
		opacity: 0.7
	},
	buttonText: {
		textAlign: "center",
		color: "white",
		fontSize: 18,
		fontWeight: "bold"
	}
});
