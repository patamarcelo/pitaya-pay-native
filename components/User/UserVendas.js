import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	RefreshControl
} from "react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import { userSelector } from "../../store/redux/selector";
import { useSelector } from "react-redux";
import { getTransactionsById } from "../../utils/firebase/firebase.datatable";

import Button from "../ui/Button";

import { Divider } from "react-native-paper";
import { Skeleton, LinearGradient } from "@rneui/themed";

import CardVendas from "./CardVendas";

import { Colors } from "../../constants/styles";

const UserVendas = ({ navigation }) => {
	const user = useSelector(userSelector);
	const { uid } = user;
	const [sellerData, setSellerData] = useState([]);
	const [titleSelected, setTitleSelected] = useState("30 dias");
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [filterDays, setFilterDays] = useState(30);
	const [filteredData, setFilteredData] = useState([]);

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
		const getSellerTransactions = async () => {
			setIsLoading(true);
			const sellerData = await getTransactionsById(uid);
			setIsLoading(false);
			setSellerData(sellerData);
			setFilteredData(sellerData);
		};
		try {
			getSellerTransactions();
		} catch (err) {
			console.log("erro ao pegar os dados: ", err);
		} finally {
		}
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Vendas",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			headerShown: true,
			contentStyle: { backgroundColor: "white" }
		});
	}, []);

	const handlerSelected = (title, days) => {
		setTitleSelected(title);
		setFilterDays(days);
	};

	const handleRefresh = () => {
		console.log("atualizando");
	};

	const dictTitle = [
		{ title: "30 dias", days: 30 },
		{ title: "60 dias", days: 60 },
		{ title: "90 dias", days: 90 },
		{ title: "Todos", days: 10000 },
		{ title: "Personalizado" }
	];

	const VendasList = (itemData) => {
		return <CardVendas data={itemData.item} />;
	};

	return (
		<View style={styles.mainContainer}>
			<View>
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
								onPress={() =>
									handlerSelected(data.title, data.days)
								}
							>
								<Text style={styles.textTitle}>
									{data.title}
								</Text>
							</Button>
						);
					})}
				</ScrollView>
			</View>
			{/* <Divider width={"100%"} /> */}
			<View style={styles.containerList}>
				<ScrollView>
					{isLoading &&
						LINES.map((data, i) => {
							return (
								<View
									style={{
										flexDirection: "row",
										width: "100%",
										gap: 10,
										marginVertical: 10,
										flex: 1
									}}
									key={i}
								>
									<Skeleton
										LinearGradientComponent={LinearGradient}
										animation="wave"
										circle
										width={40}
										height={40}
									/>
									<Skeleton width={"70%"} height={40} />
									<Skeleton circle width={40} height={40} />

									<Divider width={"100%"} />
								</View>
							);
						})}
				</ScrollView>
				{sellerData && (
					<View style={styles.containerList}>
						<FlatList
							// scrollEnabled={false}
							data={sellerData.sort(
								(a, b) => b.createdAt - a.createdAt
							)}
							keyExtractor={(item, i) => item.id}
							renderItem={VendasList}
							ItemSeparatorComponent={() => (
								<View style={{ height: 13 }} />
							)}
							refreshControl={
								<RefreshControl
									refreshing={refreshing}
									onRefresh={handleRefresh}
									colors={["#9Bd35A", "#689F38"]}
									tintColor={Colors.primary500}
								/>
							}
						/>
					</View>
				)}
			</View>
		</View>
	);
};

export default UserVendas;

const styles = StyleSheet.create({
	textBtnStl: { fontSize: 12 },
	containerList: {
		width: "100%",
		marginVertical: 10,
		paddingHorizontal: 10
	},
	vandasContainer: {
		height: 100,
		// backgroundColor: "red",
		width: "100%",
		height: "100%"
	},
	rootContainer: {
		marginHorizontal: 5
		// height: 20
		// flex: 3
	},
	textTitle: { color: "whitesmoke" },
	titleContainer: {
		backgroundColor: "grey",
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
		flex: 1,
		// justifyContent: "start",
		// alignItems: "center",
		marginTop: 20
	}
});
