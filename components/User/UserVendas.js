import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import { userSelector } from "../../store/redux/selector";
import { useSelector } from "react-redux";
import { getTransactionsById } from "../../utils/firebase/firebase.datatable";

import Button from "../ui/Button";

import { Divider } from "react-native-paper";
import { Skeleton } from "@rneui/themed";

const UserVendas = ({ navigation }) => {
	const user = useSelector(userSelector);
	const { uid } = user;
	const [sellerData, setSellerData] = useState([]);
	const [titleSelected, setTitleSelected] = useState("30 dias");
	const [isLoading, setIsLoading] = useState(false);

	const LINES = [
		{ line: 1 },
		{ line: 2 },
		{ line: 3 },
		{ line: 4 },
		{ line: 5 },
		{ line: 6 },
		{ line: 7 },
		{ line: 8 },
		{ line: 9 },
		{ line: 10 },
		{ line: 11 },
		{ line: 12 }
	];

	useEffect(() => {
		setIsLoading(true);
		const getSellerTransactions = async () => {
			const sellerData = await getTransactionsById(uid);
			setSellerData(sellerData);
		};
		try {
			getSellerTransactions();
		} catch (err) {
			console.log("erro ao pegar os dados: ", err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		console.log("sellerData", sellerData);
	}, [sellerData]);
	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Vendas",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			headerShown: true,
			contentStyle: { backgroundColor: "white" }
		});
	}, []);

	const handlerSelected = (title) => {
		setTitleSelected(title);
	};

	const dictTitle = [
		{ title: "30 dias" },
		{ title: "60 dias" },
		{ title: "90 dias" },
		{ title: "Todos" },
		{ title: "Personalizado" }
	];
	return (
		<View style={styles.mainContainer}>
			<ScrollView
				horizontal={true}
				style={styles.rootContainer}
				contentContainerStyle={{
					paddingTop: 5,
					paddingBottom: 15
				}}
				showsHorizontalScrollIndicator={false}
			>
				{dictTitle.map((data, i) => {
					return (
						<Button
							key={i}
							btnStyles={
								titleSelected === data.title
									? styles.titleContainerSelected
									: styles.titleContainer
							}
							textStyles={styles.textBtnStl}
							onPress={() => handlerSelected(data.title)}
						>
							<Text style={styles.textTitle}>{data.title}</Text>
						</Button>
					);
				})}
			</ScrollView>
			<Divider width={"100%"} />
			<ScrollView style={styles.vandasContainer}>
				<View>
					<Text>lista de vendas</Text>
				</View>
				{isLoading &&
					LINES.map((data, i) => {
						return (
							<View
								style={{
									justifyContent: "center",
									alignItems: "center",
									width: "100%",
									rowGap: 5,
									flex: 1
								}}
								key={i}
							>
								<Skeleton width={"90%"} height={40} />

								<Divider width={"100%"} />
							</View>
						);
					})}
			</ScrollView>
		</View>
	);
};

export default UserVendas;

const styles = StyleSheet.create({
	textBtnStl: { fontSize: 12 },
	vandasContainer: {
		height: 100,
		// backgroundColor: "red",
		width: "100%",
		height: "100%"
	},
	rootContainer: {
		marginHorizontal: 5
	},
	textTitle: { color: "whitesmoke" },
	titleContainer: {
		// backgroundColor: "grey",
		borderRadius: 12,
		paddingVertical: 5,
		marginHorizontal: 5
	},
	titleContainerSelected: {
		backgroundColor: "green",
		borderRadius: 12,
		paddingVertical: 5,
		marginHorizontal: 5
	},
	mainContainer: {
		// flex: 1,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 20
	}
});
