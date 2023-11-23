import { View, Text, StyleSheet } from "react-native";
import { useLayoutEffect } from "react";

const UserVendas = ({ navigation }) => {
	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Vendas",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			headerShown: true,
			contentStyle: { backgroundColor: "white" }
		});
	}, []);
	return (
		<View style={styles.mainContainer}>
			<Text>Vendas do Usuário</Text>
		</View>
	);
};

export default UserVendas;

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center"
	}
});
