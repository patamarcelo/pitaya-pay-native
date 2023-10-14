import { StyleSheet, View, Text } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import IconButton from "../ui/IconButton";

const CreditCardComponent = ({ navigation }) => {
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
	return (
		<View style={styles.mainContainer}>
			<Text style={styles.text}>CREDIT CARD COMPONENT</Text>
		</View>
	);
};

export default CreditCardComponent;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	text: { color: "whitesmoke" }
});
