import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Keyboard,
	TouchableWithoutFeedback
} from "react-native";
import { useState, useEffect } from "react";
import { Colors } from "../../../constants/styles";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Controller } from "react-hook-form";

import CurrencyInputType from "./CurrenyInput";
import Button from "../Button";

import { useHeaderHeight } from "@react-navigation/elements";

import ProductsComp from "../Payment/Products";

import RNPickerSelect from "react-native-picker-select";

const schema = yup.object({
	valor: yup.string().required("Informe um valor")
});

import { useNavigation } from "@react-navigation/native";

import { Ionicons } from "@expo/vector-icons";
import IconButton from "../IconButton";

import { Picker } from "@react-native-picker/picker";

const PaymentForm = ({ prevRouteName }) => {
	const [paymentValue, setPaymentValue] = useState(0);
	const [quantityProd, setQuantityProd] = useState(0);
	const [vista, setVista] = useState(true);
	const [parcelado, setParcelado] = useState(false);
	const [arrayTimes, setArrayTimes] = useState([]);

	const [selectedLanguage, setSelectedLanguage] = useState();

	const [times, setTimes] = useState(1);
	const headerHeight = useHeaderHeight();
	const navigation = useNavigation();

	useEffect(() => {
		setTimes(1);
	}, [paymentValue]);

	useEffect(() => {
		if (times === 1) {
			setParcelado(false);
			setVista(true);
		}
	}, [times]);

	useEffect(() => {
		if (prevRouteName && prevRouteName === "CARTAO") {
			setTimes(1);
		}
	}, [parcelado]);

	const handlerVista = () => {
		setVista(true);
		setParcelado(false);
	};

	const handlerParcelado = () => {
		setVista(false);
		setParcelado(true);
	};

	useEffect(() => {
		if (paymentValue >= 90) {
			const firstValue = paymentValue.toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});

			const secValue = (paymentValue / 2).toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			const thirdValue = (paymentValue / 3).toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			const newParc = [
				{ value: "1", label: `1x de ${firstValue}` },
				{ value: "2", label: `2x de ${secValue}` },
				{ value: "3", label: `3x de ${thirdValue}` }
			];
			setArrayTimes(newParc);
			return;
		}
		if (paymentValue >= 60) {
			const firstValue = paymentValue.toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});

			const secValue = (paymentValue / 2).toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			});
			const newParc = [
				{ value: "1", label: `1x de ${firstValue}` },
				{ value: "2", label: `2x de ${secValue}` }
			];
			setArrayTimes(newParc);
			return;
		}
	}, [paymentValue]);

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

	// ------------------------	PRODUTCOM -------------------------------- //
	const [products, setProducts] = useState([]);
	const [productsComp, setProductsComp] = useState([]);
	const [parcelasSelected, setParcelasSelected] = useState([]);

	const handlerChangeParcelas = (e) => {
		console.log(e);
		setParcelasSelected(e);
	};

	const handleDeleteProduct = (e) => {
		setParcelasSelected(parcelasSelected.filter((data) => data !== e));
	};

	useEffect(() => {
		const totalQuantity = products.filter((data) =>
			parcelasSelected.includes(data.codigo)
		);
		const total = products
			.filter((data) => parcelasSelected.includes(data.codigo))
			.reduce((acc, curr) => (acc += curr.valor), 0);
		if (total > 0) {
			setPaymentValue(total);
			setQuantityProd(totalQuantity.length);
		} else {
			setPaymentValue(0);
			setQuantityProd(0);
		}
	}, [productsComp, parcelasSelected]);

	// ------------------------	PRODUTCOM -------------------------------- //

	const handlerChange = (e, name) => {
		console.log("ouvindo a mudança", e, name);
		setPaymentValue(e);
	};

	const handlerChangeSelect = (e, name) => {
		console.log("ouvindo a mudança", e, name);
		setTimes(e);
	};

	const handlerConfirm = () => {
		console.log("avançar");
		console.log(paymentValue);
		if (prevRouteName && prevRouteName === "CARTAO") {
			console.log("navegue para outro lugar");
			navigation.navigate("CONFIRMCARD", {
				data: {
					valor: paymentValue,
					produtos: parcelasSelected,
					times: times
				}
			});
		} else {
			navigation.navigate("PIXMAIL", {
				data: { valor: paymentValue, produtos: parcelasSelected }
			});
		}
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<ScrollView>
				<View
					style={[
						styles.mainContainer,
						{ marginBottom: headerHeight }
					]}
				>
					<View>
						{paymentValue > 0 && (
							<Text style={styles.value}>
								R${" "}
								{paymentValue && paymentValue > 0
									? paymentValue?.toLocaleString("pt-br", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
									  })
									: "0,00"}
							</Text>
						)}
						<ProductsComp
							products={products}
							setProducts={setProducts}
							productsComp={productsComp}
							setProductsComp={setProductsComp}
							parcelasSelected={parcelasSelected}
							setParcelasSelected={setParcelasSelected}
							handlerChangeParcelas={handlerChangeParcelas}
							handleDeleteProduct={handleDeleteProduct}
							paymentValue={paymentValue}
							quantityProd={quantityProd}
						/>
					</View>
					{parcelasSelected?.length > 0 && (
						<View style={styles.form}>
							<Controller
								control={control}
								name="valor"
								render={({
									field: { onChange, onBlur, value }
								}) => (
									<CurrencyInputType
										register={register}
										nameRegister={"valor"}
										inputContainerProps={
											styles.containerProps
										}
										styleInput={{
											textAlign: "center",
											borderWidth: errors.placa && 1,
											borderColor:
												errors.placa && "#ff375b"
										}}
										// label="Valor"
										onUpdateValue={(e) => {
											handlerChange(e, "valor");
											onChange(e);
										}}
										value={paymentValue}
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
							<View>
								<Text style={styles.helperValue}>
									Altere o valor se precisar
								</Text>
							</View>
						</View>
					)}
					{prevRouteName &&
						prevRouteName === "CARTAO" &&
						paymentValue >= 60 && (
							<View style={styles.optionContainer}>
								<View>
									<Button
										btnStyles={[
											styles.btnOptStyleVista,
											vista && styles.active,
											!vista && styles.deactivetaed
										]}
										onPress={handlerVista}
									>
										À Vista
									</Button>
								</View>
								<View>
									<Button
										btnStyles={[
											styles.btnOptStyleParc,
											parcelado && styles.active,
											!parcelado && styles.deactivetaed
										]}
										onPress={handlerParcelado}
									>
										Parcelado
									</Button>
								</View>
							</View>
						)}
					{parcelado && paymentValue >= 60 && (
						<View style={styles.pickerView}>
							<Picker
								selectionColor={"rgba(255,255,255,0.2)"}
								itemStyle={{ color: "whitesmoke" }}
								style={{ height: 100 }}
								selectedValue={times}
								onValueChange={(e) => {
									handlerChangeSelect(e, "Parcelas");
								}}
							>
								{arrayTimes.map((data, i) => {
									return (
										<Picker.Item
											key={i}
											label={data.label}
											value={data.value}
										/>
									);
								})}
							</Picker>
						</View>
					)}
					{parcelasSelected?.length > 0 && (
						<Button
							btnStyles={styles.btnStyles}
							disabled={
								(!paymentValue && true) ||
								parcelasSelected.length === 0
							}
							onPress={handlerConfirm}
						>
							Avançar
						</Button>
					)}
				</View>
			</ScrollView>
		</TouchableWithoutFeedback>
	);
};

export default PaymentForm;

const styles = StyleSheet.create({
	helperValue: {
		marginBottom: 20,
		marginTop: -5,
		color: Colors.gold[100],
		width: "100%",
		textAlign: "center"
	},
	pickerView: {
		width: "200%",
		color: "black",
		justifyContent: "center",
		marginBottom: 50,
		height: 50,
		top: -20
		// alignItems: "center"
	},
	active: {
		opacity: 1,
		borderColor: Colors.succes[200],
		borderWidth: 1
	},
	deactivetaed: {
		opacity: 0.95
	},
	inputContainer: {
		marginVertical: 8,
		justifyContent: "center",
		alignItems: "center"
	},
	input: {
		justifyContent: "center",
		alignItems: "center",
		// paddingVertical: 8,
		// paddingHorizontal: 6,
		backgroundColor: "white",
		borderRadius: 4,
		width: "50%"
	},
	optionContainer: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		gap: 20,
		marginBottom: 10
	},
	btnOptStyleVista: {
		width: 120
		// backgroundColor: "yellow"
	},
	btnOptStyleParc: {
		width: 120
	},
	btnStyles: {
		width: "90%",
		marginTop: 15
	},
	form: {
		width: "50%"
	},
	inputStyles: {
		width: "100%"
	},
	mainContainer: {
		marginTop: 20,
		width: "100%",
		flex: 1,
		gap: 10,
		// justifyContent: "center",
		alignItems: "center"
	},
	title: {
		fontSize: 22,
		color: Colors.secondary[200],
		marginTop: 20
	},
	value: {
		fontSize: 24,
		color: Colors.succes[200],
		textAlign: "center",
		marginBottom: 4
	}
});

const pickerSelectStyles = StyleSheet.create({
	inputIOS: {
		fontSize: 16,
		paddingVertical: 8,
		paddingHorizontal: 6,
		borderColor: "gray",
		borderRadius: 4,
		color: "black",
		paddingRight: 30 // to ensure the text is never behind the icon
	},
	iconContainer: {
		top: 5,
		right: 15
	},
	inputAndroid: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 0.5,
		borderColor: "purple",
		borderRadius: 8,
		color: "black",
		paddingRight: 30 // to ensure the text is never behind the icon
	}
});
