import {
	View,
	Text,
	StyleSheet,
	TouchableWithoutFeedback,
	Keyboard,
	KeyboardAvoidingView
} from "react-native";
import { useSelector } from "react-redux";
import { createdUserSelector } from "../../store/redux/selector";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import IconButton from "../ui/IconButton";

import { useState, useEffect } from "react";

import axios from "axios";

import {
	CreditCardInput,
	LiteCreditCardInput
} from "react-native-credit-card-input";

import Button from "../ui/Button";

import { useDispatch } from "react-redux";
import { userActions } from "../../store/redux/usuario";

const CreditCardFormPage = ({ navigation }) => {
	const createdUser = useSelector(createdUserSelector);
	console.log("userCreatedFomCrediCardForm", createdUser);
	const dispatch = useDispatch();
	const { setCreditCardInfo, setIp } = userActions;

	const [ip, setClientIP] = useState("");
	const [cardData, setcardData] = useState({});
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

	const getData = async () => {
		const res = await axios.get("https://geolocation-db.com/json/");
		setClientIP(res.data.IPv4);
		dispatch(setIp(res.data.IPv4));
	};

	useEffect(() => {
		getData();
	}, []);

	const handlerChange = (formData) => {
		setcardData(formData);
		console.log(formData);
	};

	const handleSubmit = () => {
		dispatch(setCreditCardInfo(cardData.values));
		navigation.navigate("PAYCARDFORM");
	};

	const addtionalInputsProps = {
		name: {
			value: "marcelo pata"
			// maxLength: 40
		},
		postalCode: {
			returnKeyType: "go"
		}
	};
	return (
		<View style={styles.container}>
			<View style={styles.cardContainer}>
				<KeyboardAvoidingView>
					<LiteCreditCardInput
						allowScroll={true}
						onChange={handlerChange}
						labelStyle={styles.labelStyle}
						inputStyle={{ color: "white" }}
						labels={{
							number: "Número do Cartão",
							expiry: "Validade",
							cvc: "CVC"
						}}
						// addtionalInputsProps={{
						// 	name: {
						// 		defa
						// 	}
						// }}
						// requiresName={true}
					/>

					<View style={styles.buttonContainer}>
						<Button
							disabled={!cardData.valid}
							onPress={handleSubmit}
							btnStyles={
								!cardData.valid
									? styles.btnDisabledStyle
									: styles.btnbtnStylesRegister
							}
						>
							Avançar
						</Button>
					</View>
					{/* <Button onPress={() => navigation.navigate("PAYCARDFORM")}>
						cardForm
					</Button> */}
				</KeyboardAvoidingView>
			</View>
		</View>
	);
};

export default CreditCardFormPage;

const styles = StyleSheet.create({
	cardContainer: {
		flex: 1,
		marginTop: 60
	},
	labelStyle: {
		color: Colors.primary[900]
	},
	container: {
		flex: 1,
		marginTop: 25
	},
	avoider: {
		flex: 1,
		padding: 36
	},
	button: {
		margin: 36,
		marginTop: 0
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
	}
});
