import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import { FontAwesome5 } from "@expo/vector-icons";

import * as Clipboard from "expo-clipboard";

import {
	ALERT_TYPE,
	Dialog,
	AlertNotificationRoot,
	Toast
} from "react-native-alert-notification";

const ConfirmationPix = () => {
	const headerHeight = useHeaderHeight();
	const navigation = useNavigation();
	const route = useRoute();
	const { data } = route.params;

	const handlerBackHome = () => {
		navigation.navigate("Welcome");
	};

	const copyToClipboard = async () => {
		await Clipboard.setStringAsync("30822328000154");
		Toast.show({
			type: ALERT_TYPE.SUCCESS,
			title: "Chave Pix Copiada"
			// textBody: "Congrats! this is toast notification success"
		});
		setTimeout(() => {
			Toast.hide();
		}, 1000);
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			// headerShown: true,
			contentStyle: { backgroundColor: Colors.primary500 },
			headerLeft: () => <></>
		});

		Dialog.show({
			type: ALERT_TYPE.SUCCESS,
			title: "Feito!!",
			textBody: "Pix Gerado com Sucesso!!",
			button: "fechar"
		});
	}, []);

	return (
		<AlertNotificationRoot>
			<View
				style={[styles.mainContainer, { marginBottom: headerHeight }]}
			>
				<View style={styles.titleContainer}>
					{/* <Text style={styles.title}>PIX GERADO COM SUCESSO!!</Text> */}
					<Pressable
						style={({ pressed }) => [
							pressed && styles.pressed,
							styles.pixKeyContainer
						]}
						onPress={copyToClipboard}
					>
						<Text style={styles.pixKey}>30.822.328/0001-54</Text>
						<FontAwesome5
							name="copy"
							size={24}
							color="whitesmoke"
							style={{ marginLeft: 10 }}
						/>
					</Pressable>
				</View>
				<Image
					source={require("../../assets/payment/pix-pitaya.jpeg")}
					style={styles.img}
				/>
				<View style={styles.dataValues}>
					<Text style={styles.valor}>
						R${" "}
						{data.valor.toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</Text>
					<Text style={styles.email}>
						<Text style={styles.payTitle}>Pagador:</Text>
						<Text style={styles.emailText}>
							{" "}
							{data.email.toLowerCase()}
						</Text>
					</Text>
				</View>
				<Button btnStyles={styles.btnStyles} onPress={handlerBackHome}>
					Finalizar
				</Button>
			</View>
		</AlertNotificationRoot>
	);
};

export default ConfirmationPix;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.5
	},
	emailText: {
		fontStyle: "italic"
	},
	payTitle: {
		color: Colors.secondary[300],
		paddingRight: 10
	},
	btnStyles: {
		width: "80%"
	},
	pixKeyContainer: {
		marginTop: 10,
		// width: '100%',
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center"
		// backgroundColor: "blue"
	},
	pixKey: {
		fontSize: 15,
		color: Colors.primary[100],
		alignSelf: "center"
	},
	dataValues: {
		// flex: 1,
		marginVertical: 30,
		justifyContent: "center",
		alignItems: "center",
		gap: 20
	},
	email: {
		color: "whitesmoke",
		fontSize: 12
	},
	valor: {
		color: Colors.succes[200],
		fontSize: 24
	},
	titleContainer: {
		margin: 10,
		marginBottom: 30
	},
	title: {
		fontSize: 16,
		color: "whitesmoke",
		fontWeight: "bold"
	},
	img: {
		width: 300,
		height: 300
	},
	mainContainer: {
		flex: 1,
		marginTop: 50,
		alignItems: "center",
		justifyContent: "flex-start",
		width: "100%",
		height: "100%"
	}
});
