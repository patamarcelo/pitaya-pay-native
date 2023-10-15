import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/styles";

function LoadingOverlay({ message, style, cntStyles }) {
	return (
		<View style={[styles.rootContainer, cntStyles]}>
			<Text style={[styles.message, style]}>{message}</Text>
			<ActivityIndicator size="large" />
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
	}
});
