import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../../constants/styles";

import CurrencyInput from "react-native-currency-input";

function CurrencyInputType({
	label,
	keyboardType,
	secure,
	onUpdateValue,
	value,
	isInvalid,
	inputStyles,
	onBlur,
	placeholder,
	styleInput,
	disabled,
	multilne = false,
	numberOfLines = 2,
	inputContainerProps,
	maxLength,
	register,
	nameRegister
}) {
	return (
		<View style={[styles.inputContainer, inputContainerProps]}>
			<Text style={[styles.label, isInvalid && styles.labelInvalid]}>
				{label}
			</Text>
			<CurrencyInput
				{...register(nameRegister)}
				value={value}
				onChangeValue={onUpdateValue}
				style={[
					styles.input,
					inputStyles,
					isInvalid && styles.inputInvalid,
					styleInput
				]}
			/>
			{/* <TextInput
				style={[
					styles.input,
					inputStyles,
					isInvalid && styles.inputInvalid,
					styleInput
				]}
				// autoCapitalize={false}
				keyboardType={keyboardType}
				secureTextEntry={secure}
				onChangeText={onUpdateValue}
				value={value}
				onBlur={onBlur}
				placeholder={placeholder}
				editable={!disabled}
				selectTextOnFocus={!disabled}
				multiline={multilne}
				numberOfLines={numberOfLines}
				maxLength={maxLength}
			/> */}
		</View>
	);
}

export default CurrencyInputType;

const styles = StyleSheet.create({
	inputContainer: {
		marginVertical: 8
	},
	label: {
		color: "white",
		marginBottom: 4
	},
	labelInvalid: {
		color: Colors.error500
	},
	input: {
		paddingVertical: 8,
		paddingHorizontal: 6,
		backgroundColor: Colors.primary100,
		borderRadius: 4,
		fontSize: 16
	},
	inputInvalid: {
		backgroundColor: Colors.error100
	}
});
