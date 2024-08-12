import { View, Text, StyleSheet, Platform } from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";

import Input from "../../components/Auth/Input";

import Button from "../ui/Button";
import IconButton from "../ui/IconButton";
import { useHeaderHeight } from "@react-navigation/elements";

import { useSelector } from "react-redux";
import { userSelector } from "../../store/redux/selector";

import { createClient } from "../../utils/axios/axios.utils";

import {
	ALERT_TYPE,
	Dialog,
	AlertNotificationRoot,
	Toast
} from "react-native-alert-notification";

const schema = yup.object({
	email: yup
		.string()
		.email("inisira um e-mail válido")
		.required("inisira um e-mail válido")
});

import { useNavigation, useRoute } from "@react-navigation/native";
import LoadingOverlay from "../ui/LoadingOverlay";

import { addTransaction } from "../../utils/firebase/firebase.datatable";

// import AwesomeAlert from "react-native-awesome-alerts";

const MailForm = () => {
	const user = useSelector(userSelector);
	const [paymentValue, setPaymentValue] = useState(0);
	const headerHeight = useHeaderHeight();
	const navigation = useNavigation();
	const route = useRoute();
	const disp = Platform.OS;

	const [showAlert, setShowAlert] = useState(false);
	const [progress, setProgress] = useState(false);
	const [showContent, setShowContent] = useState(true);

	const [paymentParams, setPaymentParams] = useState({
		valor: "",
		email: ""
	});

	useEffect(() => {
		setPaymentParams({
			valor: route.params.data.valor,
			email: "",
			produtos: route.params.data.produtos
		});
	}, []);

	useEffect(() => {
		console.log("changes: ", paymentParams);
	}, [paymentParams]);

	const handleBack = () => {
		navigation.goBack();
	};

	useLayoutEffect(() => {
		setShowContent(true);
		navigation.setOptions({
			title: "Email",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			// headerShown: true,
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

	const {
		control,
		handleSubmit,
		register,
		getValues,
		setValue,
		reset,
		resetField,
		formState: { errors },
		setFocus
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			email: ""
		}
	});

	useEffect(() => {
		setFocus("email");
	}, [setFocus]);

	const handlerChange = (e, name) => {
		setPaymentParams((prev) => ({
			...prev,
			email: e.trim()
		}));
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
					Por favor tente novamente mais tarde!
				</Text>
			</View>
		);
	};

	const handlerConfirm = async (e) => {
		console.log("avançar", e);
		console.log(paymentParams);
		setShowAlert(true);
		setProgress(true);
		setShowContent(false);
		try {
			const newPaymentMethod = {
				addressKey: "pitayajoias@gmail.com",
				description: `${paymentParams.produtos} - ${
					user.displayName
						? user.displayName
						: "Vendedor sem nome cadastrado"
				}`,
				value: paymentParams.valor,
				format: "ALL"
			};

			const respPay = await createClient.post("createpixpay", null, {
				params: {
					newPaymentMethod: newPaymentMethod, 
					user: user
				}
			});
			const { data, status } = respPay;

			if (status === 200) {
				const newTrans = await addTransaction(
					user.displayName
						? user.displayName
						: "Vendedor sem nome cadastrado",
					user.email,
					user.uid,
					"pix",
					paymentParams.valor,
					"1",
					paymentParams.email,
					paymentParams.produtos,
					data.id,
					`AppNative - ${disp}`,
					"-"
				);

				setTimeout(() => {
					setShowAlert(false);
					setProgress(false);
					navigation.navigate("PIXCONFIRMATION", {
						data: {
							...paymentParams,
							pixUri: data.encodedImage,
							payCopyLoad: data.payload
						}
					});
				}, 750);
			} else {
				Dialog.show({
					type: ALERT_TYPE.DANGER,
					title: <Title text={"Ops!!"} />,
					textBody: <TrySomError />,
					button: "Finalizar"
					// onPressButton: () => {
					// 	navigation.navigate("PagamentosTab");
					// }
				});
			}
		} catch (err) {
			console.log("erro ao gerar a transação", err);
			Dialog.show({
				type: ALERT_TYPE.DANGER,
				title: <Title text={"Ops!!"} />,
				textBody: <TrySomError />,
				button: "Finalizar"
				// onPressButton: () => {
				// 	navigation.navigate("PagamentosTab");
				// }
			});
		}
	};

	if (progress) {
		return <LoadingOverlay message={"Trabalhando na sua solicitação..."} />;
	}

	if (!showContent) {
		return <></>;
	}
	return (
		<View style={[styles.mainContainer, { marginBottom: headerHeight }]}>
			<View>
				<Text style={styles.title}>Inisira o E-mail do Cliente</Text>
			</View>
			<View style={styles.form}>
				<Controller
					control={control}
					name="email"
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							register={register}
							nameRegister={"email"}
							inputContainerProps={styles.containerProps}
							styleInput={{
								borderWidth: errors.placa && 1,
								borderColor: errors.placa && "#ff375b"
							}}
							// label="Valor"
							onUpdateValue={(e) => {
								handlerChange(e, "email");
								onChange(e.trim());
							}}
							value={value}
							// keyboardType="email-address"
							onBlur={onBlur}
							inputStyles={styles.inputStyles}
							placeholder="Insira um email"
							// maxLength={7}
						/>
					)}
				/>
				{errors.email && (
					<Text style={styles.labelError}>
						{errors.email?.message}
					</Text>
				)}
			</View>
			<Button
				btnStyles={styles.btnStyles}
				disabled={
					(errors.email?.message && true) ||
					(!paymentParams.email && true)
				}
				onPress={handleSubmit(handlerConfirm)}
			>
				Gerar
			</Button>
			{/* <AwesomeAlert
				show={showAlert}
				showProgress={progress}
				title="AwesomeAlert"
				message="I have a message for you!"
				closeOnTouchOutside={true}
				closeOnHardwareBackPress={false}
				// showCancelButton={true}
				// showConfirmButton={true}
				// cancelText="No, cancel"
				// confirmText="Yes, delete it"
				// confirmButtonColor="#DD6B55"
				// onCancelPressed={() => {
				// 	this.hideAlert();
				// }}
				// onConfirmPressed={() => {
				// 	this.hideAlert();
				// }}
			/> */}
		</View>
	);
};

export default MailForm;

const styles = StyleSheet.create({
	labelError: {
		alignSelf: "flex-start",
		color: Colors.error500,
		marginBottom: 8
	},
	btnStyles: {
		width: "80%"
	},
	form: {
		width: "80%"
	},
	inputStyles: {
		width: "100%"
	},
	mainContainer: {
		width: "100%",
		flex: 1,
		gap: 10,
		justifyContent: "center",
		alignItems: "center"
	},
	title: {
		fontSize: 22,
		color: Colors.secondary[200]
	},
	value: {
		fontSize: 24,
		color: "whitesmoke"
	}
});
