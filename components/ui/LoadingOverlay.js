import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";

function LoadingOverlay({
	message,
	style,
	cntStyles,
	overContent = false,
	color = "grey"
}) {
	return (
		<View
			style={[
				styles.rootContainer,
				cntStyles,
				overContent && styles.overContent
			]}
		>
			<Text style={[styles.message, style]}>{message}</Text>
			<ActivityIndicator size="large" color={color} />
		</View>
	);
}

export default LoadingOverlay;

const styles = StyleSheet.create({
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 32
	},
	message: {
		fontSize: 16,
		marginBottom: 12,
		color: "whitesmoke"
	},
	overContent: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "rgba(195, 11, 100, 0.8)"
	}
});
