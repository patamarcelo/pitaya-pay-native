import { StyleSheet, View, Text } from "react-native";

const PixComponent = () => {
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>PIX COMPONENT</Text>
		</View>
	);
};

export default PixComponent;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	text: { color: "whitesmoke" }
});
