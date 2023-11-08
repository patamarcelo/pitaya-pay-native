import { View, Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";

import { useState } from "react";
import LoadingOverlay from "../ui/LoadingOverlay";

import {
	ALERT_TYPE,
	Dialog,
	AlertNotificationRoot,
	Toast
} from "react-native-alert-notification";

import { confirmPaymentSelector } from "../../store/redux/selector";
const ConfirmCardPage = ({ navigation, route }) => {
	const { produtos, valor, times } = route.params.data;
	const dataPay = useSelector(confirmPaymentSelector);
	const [isLoading, setIsLoading] = useState(false);

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

	const Title = ({ text }) => {
		return (
			<View style={{ paddingTop: 40 }}>
				<Text style={{ color: "whitesmoke", fontWeight: "bold" }}>
					{text}
				</Text>
			</View>
		);
	};

	const TrySom = ({ email }) => {
		return (
			<View style={{ width: "100%" }}>
				<Text
					style={{
						color: "whitesmoke",
						textAlign: "center",
						fontSize: 12,
						marginTop: 20
					}}
				>
					<Text style={{ fontWeight: "bold" }}>
						Transação confirmada!!
					</Text>
				</Text>
				<Text
					style={{
						color: "whitesmoke",
						textAlign: "center",
						marginBottom: 20,
						fontSize: 12,
						marginTop: 20
					}}
				>
					Comprovante enviado para:{" "}
					<Text style={{ fontWeight: "bold" }}>{email}</Text>
				</Text>
				<Text
					style={{
						color: Colors.gold[200],
						textAlign: "center",
						fontSize: 8
					}}
				>
					Caso o cliente não receba o comprovante, falar com o
					financeiro@pitayajoias.com.br
				</Text>
			</View>
		);
	};

	const handleSubmit = () => {
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false);
			Dialog.show({
				type: ALERT_TYPE.SUCCESS,
				title: <Title text={"Feito!!"} />,
				textBody: (
					<TrySom email={dataPay.createdUser.email.toLowerCase()} />
				),
				button: "Finalizar",
				onPressButton: () => {
					navigation.navigate("PagamentosTab");
				}
			});
		}, 1500);
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

	const cardNumber = `**** **** **** ${dataPay.creditCardInfo.number
		.replaceAll(" ", "")
		.slice(-4)}`;
	const cvcNumber = `*${dataPay.creditCardInfo.cvc.slice(-2)}`;
	const dateCard = dataPay.creditCardInfo.expiry;
	const cpfNumber = `${dataPay.createdUser.cpfCnpj.slice(
		0,
		3
	)}.${dataPay.createdUser.cpfCnpj.slice(
		3,
		6
	)}.${dataPay.createdUser.cpfCnpj.slice(
		6,
		9
	)}-${dataPay.createdUser.cpfCnpj.slice(-2)}`;

	// let newPayment;
	// 	if (times > 1) {
	// 		newPayment = {
	// 			customer: state.userCreated.id,
	// 			billingType: "CREDIT_CARD",
	// 			dueDate: today,
	// 			totalValue: Number(valuePay),
	// 			description: "paymentFromPitayaPay",
	// 			creditCard: state.creditCard,
	// 			creditCardHolderInfo: state.creditCardHolderInfo,
	// 			remoteIp: ip,
	// 			installmentCount: times
	// 		};
	// 	} else {
	// 		newPayment = {
	// 			customer: state.userCreated.id,
	// 			billingType: "CREDIT_CARD",
	// 			dueDate: today,
	// 			value: Number(valuePay),
	// 			description: "paymentFromPitayaPay",
	// 			creditCard: state.creditCard,
	// 			creditCardHolderInfo: state.creditCardHolderInfo,
	// 			remoteIp: ip
	// 		};
	// 	}

	// const handlerCofirmCard = async () => {
	// 	setCreateUserLoader(true);
	// 	try {
	// 		const newPaymentRequest = await createClient.post(
	// 			"createpayment",
	// 			null,
	// 			{
	// 				params: {
	// 					newPaymentMethod
	// 				}
	// 			}
	// 		);
	// 		const { status } = await newPaymentRequest;
	// 		const { data } = await newPaymentRequest;
	// 		if (status === 200) {
	// 			console.log(newPaymentRequest);
	// 			dispatch({
	// 				type: ACTIONS_TYPES.SET_REALIZED_OPERATION,
	// 				payload: data
	// 			});
	// 			setStage(4);
	// 		}
	// 		try {
	// 			await addTransaction(
	// 				user.displayName,
	// 				user.email,
	// 				user.uid,
	// 				"credito",
	// 				valuePay,
	// 				times,
	// 				state.creditCardHolderInfo.email,
	// 				producttoSellList
	// 			);
	// 		} catch (err) {
	// 			console.log("Problema ao salvar transacao no Firebase: ", err);
	// 		}
	// 	} catch (error) {
	// 		console.log("erro ao gerar o pagamento", error);
	// 		MySwal.fire({
	// 			title: "Erro ...",
	// 			text: "Por favor confirmar os dados do pagamento!!",
	// 			icon: "error",
	// 			confirmButtonText: "Revisar"
	// 		}).then(result => {
	// 			if (result.isConfirmed) {
	// 				setStage(1);
	// 			}
	// 		});
	// 	} finally {
	// 		setCreateUserLoader(false);
	// 	}
	// 	// setStage(4);
	// };

	if (isLoading) {
		return <LoadingOverlay message={"Processando o Pagamento..."} />;
	}
	return (
		<AlertNotificationRoot>
			<View style={styles.mainContainer}>
				<View style={styles.titleContainer}>
					<Text style={styles.textTitleContainer}>
						Confirme os Dados
					</Text>
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
							<Text style={styles.labelText}>
								Forma de Pagamento
							</Text>
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
							<Text style={styles.valueText}>{cardNumber}</Text>
						</View>
					</View>
					<View style={styles.dataContainer}>
						<View style={styles.labelColumn}>
							<Text style={styles.labelText}>CVC</Text>
						</View>
						<View style={styles.valueColumn}>
							<Text style={styles.valueText}>{cvcNumber}</Text>
						</View>
					</View>
					<View style={styles.dataContainer}>
						<View style={styles.labelColumn}>
							<Text style={styles.labelText}>Validade</Text>
						</View>
						<View style={styles.valueColumn}>
							<Text style={styles.valueText}>{dateCard}</Text>
						</View>
					</View>
					<View style={styles.dataContainer}>
						<View style={styles.labelColumn}>
							<Text style={styles.labelText}>
								Titular do Cartão
							</Text>
						</View>
						<View style={styles.valueColumn}>
							<Text style={styles.valueText}>
								{dataPay.createdUser.name}
							</Text>
						</View>
					</View>
					<View style={styles.dataContainer}>
						<View style={styles.labelColumn}>
							<Text style={styles.labelText}>CPF</Text>
						</View>
						<View style={styles.valueColumn}>
							<Text style={styles.valueText}>{cpfNumber}</Text>
						</View>
					</View>
					<View style={styles.dataContainer}>
						<View style={styles.labelColumn}>
							<Text style={styles.labelText}>E-mail</Text>
						</View>
						<View style={styles.valueColumn}>
							<Text style={styles.valueText}>
								{dataPay.createdUser.email.toLowerCase()}
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
		</AlertNotificationRoot>
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
		fontWeight: "bold",
		width: "100%",
		textAlign: "center",
		opacity: 0.9
	},
	valueText: {
		fontSize: 14,
		backgroundColor: Colors.primary[600],
		overflow: "hidden",
		borderRadius: 8,
		// borderColor: "black",
		// borderWidth: 1,
		color: "whitesmoke",
		width: "120%",
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
