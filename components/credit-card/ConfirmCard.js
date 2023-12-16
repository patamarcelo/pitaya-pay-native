import { View, Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

import { useSelector } from "react-redux";
import { Divider } from "react-native-paper";

import { useState } from "react";
import LoadingOverlay from "../ui/LoadingOverlay";

import moment from "moment";

import {
	ALERT_TYPE,
	Dialog,
	AlertNotificationRoot,
	Toast
} from "react-native-alert-notification";

import {
	confirmPaymentSelectorUser,
	confirmPaymentSelectorCardInfo,
	confirmPaymentSelectorIp,
	userSelector
} from "../../store/redux/selector";

import { createClient } from "../../utils/axios/axios.utils";

import { userActions } from "../../store/redux/usuario";
import { useDispatch } from "react-redux";

import { addTransaction } from "./../../utils/firebase/firebase.datatable";

const ConfirmCardPage = ({ navigation, route }) => {
	const { produtos, valor, times } = route.params.data;

	const dispatch = useDispatch();
	const createdUser = useSelector(confirmPaymentSelectorUser);
	const creditCardInfo = useSelector(confirmPaymentSelectorCardInfo);
	const clientIp = useSelector(confirmPaymentSelectorIp);
	const user = useSelector(userSelector);

	const { clearData } = userActions;

	const [isLoading, setIsLoading] = useState(false);

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
					Comprovante enviado por email para:{" "}
					<Text style={{ fontWeight: "bold" }}>{email}</Text>
				</Text>
				<Text
					style={{
						color: Colors.gold[200],
						textAlign: "center",
						fontSize: 8
					}}
				>
					Caso o cliente não receba o comprovante, falar com
					financeiro@pitayajoias.com.br
				</Text>
			</View>
		);
	};
	const TrySomError = ({ email }) => {
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
						Parece que alguma coisa saiu errado..
					</Text>
				</Text>
				<Text
					style={{
						color: Colors.gold[200],
						textAlign: "center",
						marginBottom: 20,
						fontSize: 12,
						marginTop: 20
					}}
				>
					Por favor confira os dados e tente novamente mais tarde!
				</Text>
			</View>
		);
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

	const cardNumber = `**** **** **** ${creditCardInfo?.number
		?.replaceAll(" ", "")
		?.slice(-4)}`;
	const cvcNumber = `*${creditCardInfo?.cvc?.slice(-2)}`;
	const dateCard = creditCardInfo?.expiry;
	const cpfNumber = `${createdUser?.cpfCnpj?.slice(
		0,
		3
	)}.${createdUser?.cpfCnpj?.slice(3, 6)}.${createdUser?.cpfCnpj?.slice(
		6,
		9
	)}-${createdUser?.cpfCnpj?.slice(-2)}`;

	console.log(times, typeof times);

	let newPayment;
	const datetime = new Date();
	const today = moment(datetime).format("YYYY-MM-DD");
	const creditCardHolder = {
		name: createdUser.name,
		email: createdUser.email,
		cpfCnpj: createdUser.cpfCnpj,
		postalCode: createdUser.postalCode,
		addressNumber: createdUser.addressNumber,
		phone: createdUser.phone
	};
	const creditCardI = {
		holderName: createdUser.name,
		number: creditCardInfo.number.replaceAll(" ", ""),
		expiryMonth: creditCardInfo.expiry.split("/")[0],
		expiryYear: `20${creditCardInfo.expiry.split("/")[1]}`,
		ccv: creditCardInfo.cvc
	};
	if (times > 1) {
		newPayment = {
			customer: createdUser.id,
			billingType: "CREDIT_CARD",
			dueDate: today,
			totalValue: Number(valor),
			description: "paymentFromPitayaPay",
			creditCard: creditCardI,
			creditCardHolderInfo: creditCardHolder,
			remoteIp: clientIp,
			installmentCount: times
		};
	} else {
		newPayment = {
			customer: createdUser.id,
			billingType: "CREDIT_CARD",
			dueDate: today,
			value: Number(valor),
			description: "paymentFromPitayaPay",
			creditCard: creditCardI,
			creditCardHolderInfo: creditCardHolder,
			remoteIp: clientIp
		};
	}

	const handlerCofirmCard = async () => {
		setIsLoading(true);
		try {
			const newPaymentRequest = await createClient.post(
				"createpayment",
				null,
				{
					params: {
						newPaymentMethod: newPayment
					}
				}
			);
			const { status } = await newPaymentRequest;
			const { data } = await newPaymentRequest;
			if (status === 200) {
				console.log(newPaymentRequest);
				Dialog.show({
					type: ALERT_TYPE.SUCCESS,
					title: <Title text={"Feito!!"} />,
					textBody: (
						<TrySom email={createdUser.email.toLowerCase()} />
					),
					button: "Finalizar",
					onPressButton: () => {
						navigation.navigate("PagamentosTab");
					}
				});
			}
			try {
				await addTransaction(
					user.displayName,
					user.email,
					user.uid,
					"credito",
					valor,
					times,
					createdUser.email,
					produtos
				);
			} catch (err) {
				console.log("Problema ao salvar transacao no Firebase: ", err);
				Dialog.show({
					type: ALERT_TYPE.DANGER,
					title: <Title text={"Ops!!"} />,
					textBody: <TrySomError />,
					button: "Finalizar"
				});
			}
		} catch (error) {
			console.log("erro ao gerar o pagamento", error);
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: <Title text={"Ops!!"} />,
				textBody: <TrySomError />,
				button: "Finalizar"
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = () => {
		setIsLoading(true);
		handlerCofirmCard();
	};

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
								{createdUser.name}
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
								{createdUser?.email?.toLowerCase()}
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
			{isLoading && (
				<LoadingOverlay
					color={"whitesmoke"}
					overContent={true}
					message={"Processando o Pagamento..."}
					style={{ fontWeight: "bold" }}
				/>
			)}
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
		fontSize: 16,
		backgroundColor: Colors.primary[600],
		overflow: "hidden",
		borderRadius: 8,
		borderColor: "whitesmoke",
		borderWidth: 0.19,
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
