import { StyleSheet, Text, View } from "react-native";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "../constants/styles";

function UserScreen() {
	const navigation = useNavigation();
	const handleTermsNav = () => {
		navigation.navigate("ServiceTerms");
	};
	return (
		<View style={styles.rootContainer}>
			<View style={styles.data}>
				<Text style={styles.title}>UserScreen</Text>
			</View>
			<View style={styles.terms}>
				<Button
					textStyles={styles.textStyles}
					btnStyles={styles.btnStyles}
					onPress={handleTermsNav}
				>
					Termos de Serviço
				</Button>
			</View>
		</View>
	);
}

export default UserScreen;

const styles = StyleSheet.create({
	textStyles: {
		color: "blue",
		fontWeight: "500",
		textDecorationLine: "underline"
	},
	btnStyles: {
		backgroundColor: "white",
		elevation: 0,
		// shadowColor: "transparent",
		shadowOffset: { width: 0, height: 0 },
		shadowOpacity: 0,
		shadowRadius: 0
	},
	rootContainer: {
		flex: 1,
		justifyContent: "space-between",
		alignItems: "center",
		padding: 32
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	}
});
