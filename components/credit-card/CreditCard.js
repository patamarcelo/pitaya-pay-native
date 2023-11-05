import { StyleSheet, View, Text } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import IconButton from "../ui/IconButton";
import CreditCardUserForm from "./UserForm";
import Button from "../ui/Button";

const CreditCardComponent = ({ navigation }) => {
	const handleBack = () => {
		navigation.goBack();
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Cartão de Crédito",
			headerShadowVisible: false,
			headerTintColor: "whitesmoke",
			headerShown: true,
			contentStyle: { backgroundColor: Colors.primary500 },
			headerLeft: ({ tintColor }) => (
				<IconButton
					icon="arrow-back"
					color={tintColor}
					size={24}
					onPress={handleBack}
				/>
			)
		});
	}, []);
	return (
		<View style={styles.mainContainer}>
			<CreditCardUserForm />
			<Button onPress={() => navigation.navigate("CARTAOFORM")}>
				cardForm
			</Button>
		</View>
	);
};

export default CreditCardComponent;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: "100%"
	},
	text: { color: "whitesmoke" }
});
