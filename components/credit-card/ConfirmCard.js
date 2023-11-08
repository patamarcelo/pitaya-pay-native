import { View, Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import { useSelector } from "react-redux";

import { confirmPaymentSelector } from "../../store/redux/selector";
const ConfirmCardPage = ({ navigation, route }) => {
	const { produtos, valor, times } = route.params.data;
	const dataPay = useSelector(confirmPaymentSelector);

	console.log("dataPay: ", dataPay);
	console.log("produtos: , ", produtos, "valor: ", valor);
	const handleBack = () => {
		navigation.goBack();
	};

	const setLabelTimes = (times) => {
		if (times === 1) {
			return "À Vista";
		}
		return `${times}x de R$ ${(valor / times).toLocaleString("pt-br", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
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
			<View style={styles.titleContainer}>
				<Text style={styles.textTitleContainer}>Confirme os Dados</Text>
			</View>
			<View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text>Valor Total:</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text>
							R${" "}
							{valor.toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})}
						</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text>Forma de Pagamento:</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text>{setLabelTimes(times)}</Text>
					</View>
				</View>
			</View>
		</View>
	);
};

export default ConfirmCardPage;

const styles = StyleSheet.create({
	labelColumn: {
		width: "50%",
		justifyContent: "flex-end",
		alignItems: "flex-end"
	},
	valueColumn: {
		width: "50%",
		justifyContent: "flex-start",
		alignItems: "flex-start"
	},
	dataContainer: {
		flexDirection: "row",
		gap: 10,
		marginVertical: 5
	},
	textTitleContainer: {
		fontSize: 20,
		color: Colors.gold[100]
	},
	titleContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});
