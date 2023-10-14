import { StyleSheet, View, Text } from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../ui/IconButton";
import { Colors } from "../../constants/styles";

import PaymentForm from "../ui/Payment/ValueForm";

const PixComponent = ({ route, navigation }) => {
	const handleBack = () => {
		navigation.goBack();
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Pix",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
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
			<PaymentForm />
		</View>
	);
};

export default PixComponent;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	text: { color: "whitesmoke" }
});
