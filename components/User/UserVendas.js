import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	FlatList,
	RefreshControl,
	Platform,
	Modal
} from "react-native";
import { useLayoutEffect, useState, useEffect } from "react";
import {
	userSelector,
	userCustomDataSelector
} from "../../store/redux/selector";
import { useSelector } from "react-redux";
import { getTransactionsById } from "../../utils/firebase/firebase.datatable";

import Button from "../ui/Button";

import { Divider } from "react-native-paper";
import { Skeleton, LinearGradient } from "@rneui/themed";

import CardVendas from "./CardVendas";

import { Colors } from "../../constants/styles";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { formatDateFirebaseCompare } from "../../utils/formatDate";

import WebView from "react-native-webview";

import { Searchbar } from "react-native-paper";

const UserVendas = ({ navigation }) => {
	const tabBarHeight = useBottomTabBarHeight();
	const user = useSelector(userSelector);
	const { uid } = user;
	const [sellerData, setSellerData] = useState([]);
	const [titleSelected, setTitleSelected] = useState("30 dias");
	const [isLoading, setIsLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [filterDays, setFilterDays] = useState(30);
	const [filteredData, setFilteredData] = useState([]);
	const [visible, setVisible] = useState(false);
	const [urlComp, seturlComp] = useState("");

	const [searchWord, setSearchWord] = useState("");

	const [filterQueryFireAll, setfilterQueryFireAll] = useState(false);

	const userCustomData = useSelector(userCustomDataSelector);
	const [cpf, setCpf] = useState(null);
	const [isSuperUser, setIsSuperUser] = useState(false);

	const [alreadyGotAll, setalreadyGotAll] = useState(false);

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

	useLayoutEffect(() => {
		setCpf(userCustomData.cpf);
		setIsSuperUser(userCustomData.admin);
	}, [userCustomData]);

	useEffect(() => {
		const getSellerTransactions = async () => {
			setIsLoading(true);
			const sellerData = await getTransactionsById(
				uid,
				isSuperUser,
				false
			);
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
	}, [isSuperUser]);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Vendas",
			headerTintColor: "whitesmoke",
			headerShadowVisible: false,
			headerShown: true,
			contentStyle: { backgroundColor: "white" }
		});
	}, []);

	useEffect(() => {
		const filteredData = sellerData.filter((data) => {
			const today = new Date();
			const priorDate = new Date().setDate(today.getDate() - filterDays);
			return (
				new Date(formatDateFirebaseCompare(data.createdAt)) > priorDate
			);
		});
		setFilteredData(filteredData);
	}, [filterDays]);

	useEffect(() => {
		const filteredData = sellerData.filter((data) => {
			const today = new Date();
			const priorDate = new Date().setDate(today.getDate() - filterDays);
			return (
				new Date(formatDateFirebaseCompare(data.createdAt)) > priorDate
			);
		});
		setFilteredData(filteredData);
	}, [sellerData]);

	const handlerSelected = (title, days) => {
		setTitleSelected(title);
		setFilterDays(days);
	};

	const handleRefresh = () => {
		console.log("atualizando");
		const getSellerTransactions = async () => {
			setIsLoading(true);
			const sellerData = await getTransactionsById(
				uid,
				isSuperUser,
				false
			);
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
		setFilterDays(30);
		setTitleSelected("30 dias");
		setalreadyGotAll(false);
	};

	const dictTitle = [
		{ title: "30 dias", days: 30 },
		{ title: "60 dias", days: 60 },
		{ title: "90 dias", days: 90 },
		{ title: "Todos", days: 10000 }
		// { title: "Personalizado" }
	];

	const handlePressUrl = (data) => {
		seturlComp(data);
		setVisible(true);
	};

	useEffect(() => {
		if (filterDays > 90) {
			if (alreadyGotAll === false) {
				setfilterQueryFireAll(true);
				console.log("maior que 90");
				const getSellerTransactions = async () => {
					setIsLoading(true);
					const sellerData = await getTransactionsById(
						uid,
						isSuperUser,
						true
					);
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
				setalreadyGotAll(true);
			}
		} else {
			setfilterQueryFireAll(false);
		}
		console.log("FilterDays", filterDays);
	}, [filterDays]);

	const VendasList = (itemData) => {
		return (
			<CardVendas data={itemData.item} handlePressUrl={handlePressUrl} />
		);
	};

	return (
		<>
			<Modal
				visible={visible}
				presentationStyle="pageSheet"
				onRequestClose={() => setVisible(false)}
				animationType="slide"
			>
				<WebView source={{ uri: urlComp }} />
			</Modal>
			<View
				style={[
					styles.mainContainer,
					{
						marginBottom:
							Platform.OS === "ios"
								? tabBarHeight - 20
								: tabBarHeight + 10
					}
				]}
			>
				<View
					style={{
						justifyContent: "center",
						alignItems: "center",
						width: "100%"
						// backgroundColor: "red"
					}}
				>
					<View style={styles.rootContainer}>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "center",
								alignItems: "center",
								width: "100%"
							}}
						>
							{/* <View style={styles.searchContainer}>
								<Searchbar
									inputStyle={{
										fontSize: 12,
										height: 40,
										minHeight: 0
									}}
									style={{ height: 40 }}
									elevation={2}
									placeholder="Pesquisar pelo código"
									onChangeText={setSearchWord}
									value={searchWord}
								/>
							</View> */}
							<View
								style={{ flexDirection: "row", width: "100%" }}
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
												handlerSelected(
													data.title,
													data.days
												)
											}
										>
											<Text style={styles.textTitle}>
												{data.title}
											</Text>
										</Button>
									);
								})}
							</View>
						</View>
					</View>
				</View>
				<Divider
					width={"100%"}
					style={{
						backgroundColor: Colors.primary500,
						height: 0.5,
						marginBottom: 5
					}}
				/>
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
											LinearGradientComponent={
												LinearGradient
											}
											animation="wave"
											circle
											width={40}
											height={40}
										/>
										<Skeleton width={"70%"} height={40} />
										<Skeleton
											circle
											width={40}
											height={40}
										/>

										<Divider width={"100%"} />
									</View>
								);
							})}
					</ScrollView>
					{sellerData && (
						<View style={styles.containerList}>
							<FlatList
								// scrollEnabled={false}
								data={filteredData.sort(
									(a, b) => b.createdAt - a.createdAt
								)}
								keyExtractor={(item, i) => item.id}
								renderItem={VendasList}
								ItemSeparatorComponent={() => (
									<View style={{ height: 9 }} />
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
		</>
	);
};

export default UserVendas;

const styles = StyleSheet.create({
	searchContainer: { width: "100%", marginBottom: 10 },
	textBtnStl: { fontSize: 12 },
	containerList: {
		width: "100%",
		// marginVertical: 10,
		paddingHorizontal: 5
	},
	vandasContainer: {
		height: 100,
		// backgroundColor: "red",
		width: "100%",
		height: "100%"
	},
	rootContainer: {
		marginHorizontal: 5,
		marginBottom: 5,
		width: "100%",
		paddingHorizontal: 10

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
		marginTop: 20,
		width: "100%"
	}
});
