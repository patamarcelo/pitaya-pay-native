import { StyleSheet, Text, View } from "react-native";
import Button from "../components/ui/Button";
import { useNavigation } from "@react-navigation/native";

import { useEffect, useLayoutEffect, useState } from "react";
import UserData from "../components/User/UserData";
import { Colors } from "../constants/styles";
import IconButton from "../components/ui/IconButton";
import { useSelector } from "react-redux";
import { userSelector } from "../store/redux/selector";

import CardButton from "../components/ui/CardButton";

function UserScreen() {
	const user = useSelector(userSelector);
	const { displayName } = user;

	const navigation = useNavigation();
	const handleTermsNav = () => {
		navigation.navigate("ServiceTerms");
	};

	const [refreshData, setRefreshData] = useState(false);
	const handleRefresh = () => {
		console.log("refresgData");
		setRefreshData(true);
	};

	const handleRefreshPush = () => {
		console.log("refresgData");
		setRefreshData(true);
	};
	useLayoutEffect(() => {
		navigation.setOptions({
			tabBarLabel: "Vendedora",
			title: displayName ? displayName : "User Name",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			headerShown: true,
			contentStyle: { backgroundColor: "white" }
			// headerRight: ({ tintColor }) => (
			// 	<IconButton
			// 		icon="file-text"
			// 		color={tintColor}
			// 		size={20}
			// 		onPress={handleTermsNav}
			// 		type="awesome"
			// 		btnStyles={{ marginRight: 15 }}
			// 	/>
			// )
			// headerRight: ({ tintColor }) => (
			// 	<IconButton
			// 		icon="refresh"
			// 		color={tintColor}
			// 		size={22}
			// 		onPress={handleRefresh}
			// 		type="awesome"
			// 		btnStyles={{ marginRight: 20 }}
			// 	/>
			// )
		});
	}, []);

	return (
		<View style={styles.rootContainer}>
			{/* <CardButton
				textTitle="Produtos"
				nextUrl="DATAUSER"
				btnStyles={styles.btnStyle}
			/> */}
			<CardButton
				btnStyles={styles.btnStyle}
				textTitle="Cobranças Emitidas"
				nextUrl="VENDASUSER"
			/>
		</View>
	);
}

export default UserScreen;

const styles = StyleSheet.create({
	btnStyle: {
		height: 50,
		width: "80%"
	},
	iconContainer: {
		flexDirection: "row",
		width: 120,
		justifyContent: "space-around"
	},
	textStyles: {
		color: "blue",
		fontWeight: "500",
		fontSize: 12,
		textDecorationLine: "underline"
	},
	btnStyles: {
		backgroundColor: "whitesmoke"
		// elevation: 0
		// shadowColor: "transparent",
		// shadowOffset: { width: 0, height: 0 },
		// shadowOpacity: 0,
		// shadowRadius: 0
	},
	rootContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 10,
		marginTop: 10,
		width: "100%",
		gap: 20
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 8
	},
	data: {
		width: "100%",
		justifyContent: "center",
		alignItems: "center"
	}
});
