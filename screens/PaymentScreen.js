import { StyleSheet, Text, View } from "react-native";
import CardButton from "../components/ui/CardButton";
import { Colors } from "../constants/styles";
import { useLayoutEffect, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const PaymentScreen = () => {
	// const navigate = useNavigation();

	return (
		<View style={styles.mainContainer}>
			<Text style={styles.titleLayout}>
				Selecione sua forma de pagamento:
			</Text>
			<CardButton type="pix" nextUrl="pixStack" />
			<CardButton type="creditCard" nextUrl="cartaoStack" />
			<CardButton type="linkPay" nextUrl="linkPayStack" />
		</View>
	);
};

export default PaymentScreen;

const styles = StyleSheet.create({
	titleLayout: {
		color: "whitesmoke",
		fontSize: 18,
		fontWeight: "bold"
	},
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
		gap: 20,
		backgroundColor: Colors.primary[500]
	}
});
