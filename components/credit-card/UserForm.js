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
	ScrollView,
	FlatList
} from "react-native";
import { useForm } from "react-hook-form";
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

import { useState, useCallback, useEffect } from "react";

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

	const [keyboardVisible, setKeyboardVisible] = useState(false);

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
			setKeyboardVisible(true);
		});

		const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
			setKeyboardVisible(false);
		});

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);




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
		<SafeAreaView style={styles.mainContainer}>
			<KeyboardAvoidingView
				style={styles.keyboardAvoidingView}
				behavior={Platform.OS === "ios" ? "padding" : "position"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 0} // Adjust this based on your header height
			>
				<FlatList
					data={INPUTDATA}
					keyExtractor={(item) => item.title}
					renderItem={({ item }) => (
						<View style={{ width: "100%" }}>
							<Controller
								control={control}
								name={item.title}
								render={({ field: { onChange, onBlur, value } }) => (
									<Input
										styleInput={{
											borderWidth: errors[item.title] && 1,
											borderColor: errors[item.title] && "#ff375b"
										}}
										label={item.label}
										onUpdateValue={(e) => {
											if (item.title !== "name") {
												onChange(e.trim());
											} else {
												onChange(e);
											}
										}}
										value={value}
										onBlur={onBlur}
										inputStyles={styles.inputStyles}
										placeholder={item.placeholder}
										maxLength={item.maxLen}
										inputContainerProps={{ width: "100%" }}
									/>
								)}
							/>
							{errors[item.title] && (
								<Text style={styles.labelError}>
									{errors[item.title]?.message}
								</Text>
							)}
						</View>
					)}
					showsVerticalScrollIndicator={false} // Hide vertical scroll bar
					showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar (if needed)
					keyboardShouldPersistTaps="handled" // Dismiss keyboard on tap
					contentContainerStyle={{ flexGrow: 1 }} // Allows scrolling properly
					ListHeaderComponent={
						<View style={styles.titleForm}>
							<Text style={styles.titleForm}>Dados do Titular do Cartão</Text>
						</View>
					}
				/>

			</KeyboardAvoidingView>
			{
				Platform.OS === "ios" && (
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
					</View>
				)
			}
			{!keyboardVisible && Platform.OS !== "ios" &&(
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
				</View>
			)
			}
		</SafeAreaView >
	);
};

export default CreditCardUserForm;

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	titleForm: {
		fontSize: 19,
		color: Colors.gold[200],
		fontStyle: "italic",
		textAlign: 'center'
	},
	mainContainer: {
		flex: 1,
		width: Platform.OS === 'ios' ? '90%' : '100%',
		paddingHorizontal: Platform.OS === 'ios' ? 80 : 10,
		marginVertical: 20,
		// justifyContent: 'center'
	},
	form: {
		flex: 1,
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10
	},
	buttonContainer: {
		width: "100%",
		position: 'absolute',
		bottom: 0,
		paddingBottom: 40,
		justifyContent: 'center',
		backgroundColor: 'rgba(195,11,100,1)',
		paddingTop: 20,
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
