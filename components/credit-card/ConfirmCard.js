import { View, Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import IconButton from "../ui/IconButton";

const ConfirmCardPage = ({ navigation, route }) => {
	const { produtos, valor } = route.params.data;

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
			<Text>Confirm Card Screen</Text>
		</View>
	);
};

export default ConfirmCardPage;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1
	}
});
