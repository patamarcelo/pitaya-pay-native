import { StyleSheet, Text, View } from "react-native";
import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
	// const navigate = useNavigation();

	return (
		<View style={styles.mainContainer}>
			<CardButton type="pix" nextUrl="pixStack" />
			<CardButton type="creditCard" nextUrl="cartaoStack" />
		</View>
	);
};

export default PaymentScreen;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		gap: 20,
		backgroundColor: Colors.primary[500]
	}
});
