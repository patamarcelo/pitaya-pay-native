import {
	StyleSheet,
	View,
	Text,
	Keyboard,
	TouchableWithoutFeedback,
	Platform
} from "react-native";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import IconButton from "../ui/IconButton";
import { Colors } from "../../constants/styles";

import PaymentForm from "../ui/Payment/ValueForm";

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
		<KeyboardAwareScrollView
		// behavior={Platform.OS === "ios" ? "padding" : "height"}
		// style={styles.container}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View style={styles.mainContainer}>
					<PaymentForm />
				</View>
			</TouchableWithoutFeedback>
		</KeyboardAwareScrollView>
	);
};

export default PixComponent;

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	},
	text: { color: "whitesmoke" }
});
