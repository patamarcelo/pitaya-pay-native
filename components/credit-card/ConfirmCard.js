import { View, Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";

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
		if (parseInt(times.trim()) === 1) {
			return "À Vista";
		}
		return `${times}x de R$ ${(valor / times).toLocaleString("pt-br", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})}`;
	};

	const handleSubmit = () => {
		console.log("confirmar");
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "",
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
				<Divider
					style={{
						alignSelf: "stretch",
						backgroundColor: "#fff",
						marginHorizontal: 5
					}}
				/>
			</View>
			<View style={styles.resumeContainer}>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>Valor Total</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>
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
						<Text style={styles.labelText}>Forma de Pagamento</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>
							{setLabelTimes(times)}
						</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>Cartão</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>
							**** **** **** 1234
						</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>CVC</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>**2</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>Validade</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>01/24</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>Titular do Cartão</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>Marcelo Pata</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>CPF</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>019.242.88028</Text>
					</View>
				</View>
				<View style={styles.dataContainer}>
					<View style={styles.labelColumn}>
						<Text style={styles.labelText}>E-mail</Text>
					</View>
					<View style={styles.valueColumn}>
						<Text style={styles.valueText}>
							patamarcelo@gmail.com
						</Text>
					</View>
				</View>
			</View>
			<View style={styles.buttonContainer}>
				<Button
					onPress={handleSubmit}
					btnStyles={styles.btnbtnStylesRegister}
				>
					Confirmar
				</Button>
			</View>
		</View>
	);
};

export default ConfirmCardPage;

const styles = StyleSheet.create({
	resumeContainer: {
		width: "90%"
	},
	buttonContainer: {
		// flex: 1,
		width: "90%",
		margin: 20,
		gap: 10
	},
	btnbtnStylesRegister: {
		backgroundColor: "green"
	},
	labelText: {
		fontSize: 16,
		color: Colors.gold[500],

		width: "100%",
		textAlign: "center",
		opacity: 0.9
	},
	valueText: {
		fontSize: 14,
		backgroundColor: Colors.primary[200],
		overflow: "hidden",
		borderRadius: 8,
		// borderColor: "black",
		// borderWidth: 1,
		color: "black",
		width: "100%",
		textAlign: "center",
		paddingVertical: 3,
		fontWeight: "bold"
	},
	labelColumn: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	valueColumn: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	dataContainer: {
		width: "100%",
		// flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		// gap: 10,
		marginVertical: 5
	},
	textTitleContainer: {
		fontSize: 20,
		color: Colors.gold[100],
		fontWeight: "bold"
	},
	titleContainer: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	},
	mainContainer: {
		width: "100%",
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center"
	}
});
