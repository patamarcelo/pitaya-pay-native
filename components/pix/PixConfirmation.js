import { useRoute, useNavigation } from "@react-navigation/native";
import { View, Text, StyleSheet, Image } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useLayoutEffect } from "react";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";

const ConfirmationPix = () => {
	const headerHeight = useHeaderHeight();
	const navigation = useNavigation();
	const route = useRoute();
	const { data } = route.params;

	const handlerBackHome = () => {
		navigation.navigate("Welcome");
	};

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Confirmação",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			// headerShown: true,
			contentStyle: { backgroundColor: Colors.primary500 },
			headerLeft: () => <></>
		});
	}, []);

	return (
		<View style={[styles.mainContainer, { marginBottom: headerHeight }]}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>PIX GERADO COM SUCESSO!!</Text>
			</View>
			<Image
				source={require("../../assets/payment/pix-pitaya.jpeg")}
				style={styles.img}
			/>
			<View style={styles.dataValues}>
				<Text style={styles.email}>{data.email}</Text>
				<Text style={styles.valor}>
					R${" "}
					{data.valor.toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}
				</Text>
			</View>
			<Button btnStyles={styles.btnStyles} onPress={handlerBackHome}>
				Finalizar
			</Button>
		</View>
	);
};

export default ConfirmationPix;

const styles = StyleSheet.create({
	btnStyles: { width: "80%" },
	dataValues: {
		// flex: 1,
		marginVertical: 30,
		justifyContent: "center",
		alignItems: "center",
		gap: 20
	},
	email: { color: Colors.secondary[300], fontSize: 24 },
	valor: { color: "whitesmoke", fontSize: 24 },
	titleContainer: {
		margin: 10,
		marginBottom: 20
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
