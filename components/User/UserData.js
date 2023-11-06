import { StyleSheet, View, FlatList, ScrollView } from "react-native";
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

const UserData = (props) => {
	const userCustomData = useSelector(userCustomDataSelector);
	const [cpf, setCpf] = useState(null);

	useLayoutEffect(() => {
		setCpf(userCustomData.cpf);
	}, [userCustomData]);

	useEffect(() => {
		console.log("new Cpf");
	}, [cpf]);

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
						.filter((data) => data["CPF"] === cpf)
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
						.filter((data) => data["CPF"] === cpf)
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
		if (cpf) {
			getData();
		}
	}, []);

	if (isLoading) {
		return (
			<LoadingOverlay
				style={{ color: "black" }}
				message={"Atualizando os dados.."}
			/>
		);
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
		<View style={styles.mainContainer}>
			{/* {pushRefresh ? (
				<View>
					<ActivityIndicator />
				</View>
			) : null} */}
			<ScrollView
				style={styles.mainContainer}
				refreshControl={
					<RefreshControl
						refreshing={pushRefresh}
						onRefresh={handlePushRefresh}
						colors={["#9Bd35A", "#689F38"]}
						tintColor={Colors.primary500}
					/>
				}
			>
				<FlatList
					// scrollEnabled={false}
					data={userFilteredData}
					keyExtractor={(item, i) => i}
					renderItem={renderSellItem}
					ItemSeparatorComponent={() => (
						<View style={{ height: 12 }} />
					)}
				/>
			</ScrollView>
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
		width: "100%",
		flex: 1
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
