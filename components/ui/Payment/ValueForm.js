import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "../../../constants/styles";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";

import CurrencyInputType from "./CurrenyInput";
import Button from "../Button";

import { useHeaderHeight } from "@react-navigation/elements";

const schema = yup.object({
	valor: yup.string().required("Informe um valor")
});

import { useNavigation } from "@react-navigation/native";

const PaymentForm = () => {
	const [paymentValue, setPaymentValue] = useState(0);
	const headerHeight = useHeaderHeight();
	const navigation = useNavigation();

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
			valor: ""
		}
	});

	const handlerChange = (e, name) => {
		console.log("ouvindo a mudança", e, name);
		setPaymentValue(e);
	};

	const handlerConfirm = () => {
		console.log("avançar");
		console.log(paymentValue);
		navigation.navigate("PIXMAIL", { data: paymentValue });
	};

	useEffect(() => {
		setFocus("valor");
	}, [setFocus]);

	return (
		<View style={[styles.mainContainer, { marginBottom: headerHeight }]}>
			<View>
				<Text style={styles.title}>Valor a Pagar</Text>
			</View>
			<View>
				<Text style={styles.value}>
					R${" "}
					{paymentValue
						? paymentValue.toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
						  })
						: "0,00"}
				</Text>
			</View>
			<View style={styles.form}>
				<Controller
					control={control}
					name="valor"
					render={({ field: { onChange, onBlur, value } }) => (
						<CurrencyInputType
							register={register}
							nameRegister={"valor"}
							inputContainerProps={styles.containerProps}
							styleInput={{
								borderWidth: errors.placa && 1,
								borderColor: errors.placa && "#ff375b"
							}}
							// label="Valor"
							onUpdateValue={(e) => {
								handlerChange(e, "valor");
								onChange(e);
							}}
							value={value}
							// keyboardType="email-address"
							onBlur={onBlur}
							inputStyles={styles.inputStyles}
							placeholder="Insira o valor"
							// maxLength={7}
						/>
					)}
				/>
				{errors.valor && (
					<Text style={styles.labelError}>
						{errors.valor?.message}
					</Text>
				)}
			</View>
			<Button
				btnStyles={styles.btnStyles}
				disabled={!paymentValue && true}
				onPress={handlerConfirm}
			>
				Avançar
			</Button>
		</View>
	);
};

export default PaymentForm;

const styles = StyleSheet.create({
	btnStyles: {
		width: "70%"
	},
	form: {
		width: "70%"
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
