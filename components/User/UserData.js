import {
	StyleSheet,
	View,
	FlatList,
	ScrollView,
	ScrollViewBase
} from "react-native";
import { Colors } from "../../constants/styles";

import {
	userSelector,
	userCustomDataSelector
} from "../../store/redux/selector";
import { useSelector } from "react-redux";

import { useEffect, useLayoutEffect, useState } from "react";

import LoadingOverlay from "../../components/ui/LoadingOverlay";

import { Divider, Text } from "react-native-paper";
import { RefreshControl, ActivityIndicator } from "react-native";

import { Skeleton, LinearGradient } from "@rneui/themed";

import { useNavigation } from "@react-navigation/native";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

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

const UserData = (props) => {
	const tabBarHeight = useBottomTabBarHeight();
	const userCustomData = useSelector(userCustomDataSelector);
	const [cpf, setCpf] = useState(null);
	const user = useSelector(userSelector);
	const navigation = useNavigation();
	const { displayName } = user;

	useLayoutEffect(() => {
		setCpf(userCustomData.cpf);
	}, [userCustomData]);

	useEffect(() => {
		console.log("new Cpf");
	}, [cpf]);

	useLayoutEffect(() => {
		navigation.setOptions({
			tabBarLabel: "Vendedora",
			title: "Produtos",
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

	const { refreshData, setRefreshData, handleRefresh } = props;

	const url = "https://docs.google.com/spreadsheets/d/";
	const ssid = "1D9E-gGvEKmx_pZfeNRUawnQcoNK_mIhuU-FIzqYJbls";
	const query1 = `/gviz/tq?`;
	const query2 = "tqx=out:json";
	const query3 = "sheet=ResumoVendas";
	const url1 = `${url}${ssid}${query1}&${query2}&${query3}`;

	const [isLoading, setIsLoading] = useState(false);
	const [pushRefresh, setPushRefresh] = useState(false);
	const [userFilteredData, setUserFilteredData] = useState([]);

	// useEffect(() => {
	// 	console.log(userFilteredData);
	// }, [userFilteredData]);

	const getData = async () => {
		setIsLoading(true);
		try {
			await fetch(url1)
				.then((data) => data.text())
				.then((data) => {
					const temp = data.substring(47).slice(0, -2);
					const json = JSON.parse(temp);
					const columnsHeader = json.table.cols;
					let newDict = [];
					json.table.rows.forEach((row, index) => {
						let newObj = {};
						row.c.forEach((cell, index) => {
							let cellValue = cell === null ? "-" : cell.v;
							if (index === 0) {
								cellValue = cell?.f;
							}
							if (index === 5 && cellValue.length > 1) {
								cellValue = cell.f;
							}
							newObj[columnsHeader[index]?.label] = cellValue;
						});
						newDict.push(newObj);
					});
					const filtData = newDict
						.filter((data) => data["CPF"] === userCustomData.cpf)
						.sort((a, b) => a["Código"] - b["Código"]);
					setUserFilteredData(filtData);
				});
		} catch (err) {
			console.log("Erro ao pegar os dados ", err);
		} finally {
			setIsLoading(false);
		}
	};

	const getDataPush = async () => {
		console.log("get data push");
		try {
			await fetch(url1)
				.then((data) => data.text())
				.then((data) => {
					const temp = data.substring(47).slice(0, -2);
					const json = JSON.parse(temp);
					const columnsHeader = json.table.cols;
					let newDict = [];
					json.table.rows.forEach((row, index) => {
						let newObj = {};
						row.c.forEach((cell, index) => {
							let cellValue = cell === null ? "-" : cell.v;
							if (index === 0) {
								cellValue = cell?.f;
							}
							if (index === 5 && cellValue.length > 1) {
								cellValue = cell.f;
							}
							newObj[columnsHeader[index]?.label] = cellValue;
						});
						newDict.push(newObj);
					});
					const filtData = newDict
						.filter((data) => data["CPF"] === userCustomData.cpf)
						.sort((a, b) => a["Código"] - b["Código"]);
					setUserFilteredData(filtData);
				});
		} catch (err) {
			console.log("Erro ao pegar os dados ", err);
		} finally {
			console.log("doneaaa");
			setTimeout(() => {
				setPushRefresh(false);
			}, 200);
		}
	};

	useEffect(() => {
		if (refreshData) {
			try {
				getData();
			} catch (err) {
				console.log("erro ao atulizar os dados", err);
			} finally {
				setRefreshData(false);
			}
		}
	}, [refreshData]);

	useEffect(() => {
		if (pushRefresh) {
			try {
				getDataPush();
				console.log("get data");
			} catch (err) {
				console.log("erro ao atulizar os dados", err);
			} finally {
				// setPushRefresh(false);
			}
		}
	}, [pushRefresh]);

	useEffect(() => {
		if (userCustomData.cpf) {
			getData();
		}
	}, []);

	if (isLoading) {
		return LINES.map((data, i) => {
			return (
				<View
					style={{
						justifyContent: "space-around",
						// alignItems: "space-between",
						width: "100%",
						// rowGap: 5,
						flex: 1
					}}
					key={i}
				>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center"
						}}
					>
						<Skeleton
							width={"20%"}
							height={20}
							LinearGradientComponent={LinearGradient}
							animation="wave"
						/>
						<Skeleton
							width={"20%"}
							height={20}
							LinearGradientComponent={LinearGradient}
							animation="wave"
						/>
						<Skeleton
							width={"20%"}
							height={20}
							LinearGradientComponent={LinearGradient}
							animation="wave"
						/>
					</View>
					<View>
						<Divider width={"100%"} />
					</View>
				</View>
			);
		});
	}

	const handlePushRefresh = () => {
		setPushRefresh(true);
	};

	const renderSellItem = (itemData) => {
		return (
			<View style={styles.mainListContainer}>
				<View style={styles.renderItemContainer}>
					<View>
						<Text style={styles.titleCard}>Código</Text>
						<Text style={styles.valueCard}>
							{itemData.item["Código"]}
						</Text>
					</View>
					<View>
						<Text style={styles.titleCard}>Valor</Text>
						<Text style={styles.valueCard}>
							R${" "}
							{itemData.item["Valor"].toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})}
						</Text>
					</View>
					<View>
						<Text style={styles.titleCard}>Vendedor </Text>
						<Text style={styles.valueCard}>
							{itemData.item["Vendedor"]}
						</Text>
					</View>
				</View>
				<Divider />
			</View>
		);
	};

	return (
		<View style={[styles.mainContainer, { marginBottom: tabBarHeight }]}>
			{/* {pushRefresh ? (
				<View>
					<ActivityIndicator />
				</View>
			) : null} */}
			{/* <ScrollView
				style={styles.mainContainer}
				
			> */}
			<FlatList
				// scrollEnabled={false}
				data={userFilteredData}
				keyExtractor={(item, i) => i}
				renderItem={renderSellItem}
				ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
				refreshControl={
					<RefreshControl
						refreshing={pushRefresh}
						onRefresh={handlePushRefresh}
						colors={["#9Bd35A", "#689F38"]}
						tintColor={Colors.primary500}
					/>
				}
			/>
			{/* </ScrollView> */}
		</View>
	);
};

export default UserData;

const styles = StyleSheet.create({
	mainListContainer: {
		justifyContent: "space-around",
		rowGap: 10,
		flex: 1
	},
	mainContainer: {
		flex: 1,
		justifyContent: "flex-start",
		// alignItems: "flex-start",
		width: "100%",
		top: 20,
		backgroundColor: "white",
		paddingHorizontal: 10
	},
	valueCard: {
		textAlign: "center"
		// color: "whitesmoke"
	},
	titleCard: {
		fontWeight: "bold",
		textAlign: "center"
	},
	renderItemContainer: {
		flex: 1,
		width: "100%",
		flexDirection: "row",
		justifyContent: "space-between"
		// backgroundColor: "grey",
		// borderRadius: 8,
		// paddingHorizontal: 8,
		// paddingVertical: 4
	}
});
