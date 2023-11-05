import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { createdUserSelector } from "../../store/redux/selector";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import IconButton from "../ui/IconButton";

import { useState, useEffect } from "react";

import axios from "axios";

import {
	CreditCardInput
	// LiteCreditCardInput
} from "react-native-credit-card-input";

import Button from "../ui/Button";

const CreditCardFormPage = ({ navigation }) => {
	const createdUser = useSelector(createdUserSelector);
	console.log("userCreatedFomCrediCardForm", createdUser);

	const [ip, setIP] = useState("");
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
		setIP(res.data.IPv4);
		console.log(res.data.IPv4);
	};

	useEffect(() => {
		getData();
	}, []);

	const handlerChange = (formData) => {
		setcardData(formData);
		console.log(formData);
	};

	const handleSubmit = () => {
		console.log("avançar");
		console.log("dados: ", cardData.values);
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
				<CreditCardInput
					allowScroll={true}
					onChange={handlerChange}
					labelStyle={styles.labelStyle}
					inputStyle={{ color: "white" }}
					labels={{
						number: "Número do Cartão",
						expiry: "Validade",
						cvc: "CVC"
					}}
					// requiresName={true}
				/>
			</View>
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
		</View>
	);
};

export default CreditCardFormPage;

const styles = StyleSheet.create({
	cardContainer: {
		flex: 1
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
