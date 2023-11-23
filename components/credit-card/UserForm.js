import {
	View,
	Text,
	StyleSheet,
	Alert,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView
} from "react-native";
import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Controller } from "react-hook-form";
import Input from "../Auth/Input";
import Button from "../ui/Button";

import { Colors } from "../../constants/styles";
import { TestaCPF } from "../../utils/cpfTest";

import { createClient } from "../../utils/axios/axios.utils";

import {
	addTransaction,
	addCustomer
} from "../../utils/firebase/firebase.datatable";
import { signOutUser } from "../../utils/firebase/firebase";

import { useState } from "react";

import LoadingOverlay from "../ui/LoadingOverlay";
import { useDispatch } from "react-redux";
import { userActions } from "../../store/redux/usuario";

import { useNavigation } from "@react-navigation/native";

import { useHeaderHeight } from "@react-navigation/elements";

const schema = yup.object({
	name: yup.string().required("Informe o nome do titular do cartão"),
	email: yup
		.string()
		.email("Digite um email Válido")
		.required("Informe um E-mail"),
	postalCode: yup.string().required("Informe um CEP").min(8, ""),
	addressNumber: yup.string().required("Informe o número da casa"),
	phone: yup
		.string()
		.required("Por favor insira um telefone")
		.min(11, "Digite um Telefone completo com DD"),
	cpfCnpj: yup
		.string("Insira seu CPF")
		.min(11, "Insira um CPF Válido")
		.max(11, "Insira um CPF Válido")
		.test("validator-custom-name", function (value) {
			const validation = TestaCPF(value);
			if (validation === false) {
				return this.createError({
					path: this.path,
					message: "Por favor insira um CPF Válido"
				});
			} else {
				return true;
			}
		})
		.required("Este Campo é Obrigatório")
});

const INPUTDATA = [
	{ title: "name", label: "Nome", placeholder: "Nome do Titular do cartão" },
	{ title: "email", label: "E-mail", placeholder: "E-mail" },
	{ title: "cpfCnpj", label: "Cpf", placeholder: "Cpf", maxLen: 11 },
	{ title: "postalCode", label: "CEP", placeholder: "CEP", maxLen: 8 },
	{ title: "addressNumber", label: "Número da Casa", placeholder: "" },
	{
		title: "phone",
		label: "Telefone",
		placeholder: "DD+Telefone",
		maxLen: 11
	}
];
const CreditCardUserForm = () => {
	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		reset,
		resetField,
		formState: { errors }
	} = useForm({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			cpfCnpj: "",
			postalCode: "",
			addressNumber: "",
			phone: ""
		}
	});

	const [isLoading, setIsLoading] = useState(false);
	const { setCreatedUser } = userActions;
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const height = useHeaderHeight();

	const handlerChange = (e, name) => {
		console.log("Label: ", name, "value: ", e);
	};

	const submitHandler = async (valuesform) => {
		console.log("valores: ", valuesform);
		setIsLoading(true);

		try {
			const newCust = await addCustomer(
				valuesform.name,
				valuesform.email,
				valuesform.cpfCnpj,
				valuesform.phone
			);
			if (!newCust) {
				signOutUser();
			}
			const newUser = await createClient.post("createclient", null, {
				params: {
					valuesform
				}
			});
			const { status } = newUser;
			const { data } = newUser;
			if (status === 200) {
				console.log("Usuário criado com sucesso");
				dispatch(setCreatedUser(data));
				navigation.navigate("CARTAOFORM");
			}
		} catch (error) {
			console.log("error ao gerar o usuário", error.response.data);
			Alert.alert(
				"Erro ao criar o usuário, por favor veirficar os dados"
			);
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return <LoadingOverlay message={"Carregando informações..."} />;
	}
	return (
		<View style={styles.mainContainer}>
			<SafeAreaView style={styles.form}>
				{/* <ScrollView style={{ width: "100%" }}> */}
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<KeyboardAvoidingView
						keyboardVerticalOffset={height - 50}
						style={styles.form}
						behavior={Platform.OS === "ios" ? "padding" : "height"}
					>
						<View style={styles.titleForm}>
							<Text style={styles.titleForm}>
								Dados do Titular do Cartão
							</Text>
						</View>
						{INPUTDATA.map((data, i) => {
							const getTitle = data.title;
							const getLabel = data.label;
							return (
								<View key={i} style={{ width: "100%" }}>
									<Controller
										control={control}
										name={getTitle}
										render={({
											field: { onChange, onBlur, value }
										}) => (
											<Input
												styleInput={{
													borderWidth:
														errors.getTitle && 1,
													borderColor:
														errors.getTitle &&
														"#ff375b"
												}}
												label={getLabel}
												onUpdateValue={(e) => {
													handlerChange(e, getTitle);
													if (data.title !== "name") {
														onChange(e.trim());
													} else {
														onChange(e);
													}
													// onChange(
													// 	e
													// 	// .replace(/[^a-z0-9]/gi, "")
													// 	// .toUpperCase()
													// );
												}}
												value={value}
												// keyboardType="email-address"
												onBlur={onBlur}
												inputStyles={styles.inputStyles}
												placeholder={data.placeholder}
												maxLength={data.maxLen}
												inputContainerProps={{
													width: "100%"
												}}
											/>
										)}
									/>
									{errors[getTitle] && (
										<Text style={styles.labelError}>
											{errors[getTitle]?.message}
										</Text>
									)}
								</View>
							);
						})}

						<View style={styles.buttonContainer}>
							<Button
								disabled={
									Object.keys(errors).length === 0
										? false
										: true
								}
								onPress={handleSubmit(submitHandler)}
								btnStyles={
									Object.keys(errors).length === 0
										? styles.btnbtnStylesRegister
										: styles.btnDisabledStyle
								}
							>
								Avançar
							</Button>
							<Button
								onPress={() =>
									navigation.navigate("PAYCARDFORM")
								}
							>
								cardForm
							</Button>
						</View>
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>
				{/* </ScrollView> */}
			</SafeAreaView>
		</View>
	);
};

export default CreditCardUserForm;

const styles = StyleSheet.create({
	titleForm: {
		fontSize: 19,
		color: Colors.gold[200],
		fontStyle: "italic"
	},
	mainContainer: {
		flex: 1,
		width: "100%"
	},
	form: {
		flex: 5,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10
	},
	buttonContainer: {
		flex: 1,
		width: "90%",
		margin: 20,
		gap: 10
	},
	btnbtnStylesRegister: {
		backgroundColor: "green"
	},
	btnDisabledStyle: {
		backgroundColor: "grey"
	},
	labelError: {
		alignSelf: "flex-start",
		color: Colors.gold[500],
		marginBottom: 2
	},
	errorStyle: {
		borderWidth: 1,
		borderColor: "#ff375b"
	}
});
