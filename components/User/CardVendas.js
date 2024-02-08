import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-paper";

import { ICON_URL } from "../../utils/imageUrl";
import {
	formatDateFirebase,
	formatDateFirebaseRange
} from "../../utils/formatDate";

const CardVendas = ({ data, handlePressUrl }) => {
	const {
		type,
		createdAt,
		value,
		prodctsSell,
		compUrl,
		sellerName,
		clientMail
	} = data;
	const sourceImage = type ? ICON_URL[type].uri : "";
	const urlComp = compUrl?.length > 5 ? compUrl : null;
	let products = null;
	// if (prodctsSell) {
	// 	// products = prodctsSell?.split(" ").join(" - ");
	// 	console.log(typeof prodctsSell);
	// }

	const getData = (dataVenda) => {
		const todayDate = new Date();
		const todayD = todayDate.toLocaleDateString("pt-BR");
		const finalD = formatDateFirebaseRange(dataVenda);
		const todayF = todayD.trim().split("/").reverse().join("-");
		const finalF = finalD.trim().split("/").reverse().join("-");
		var dif = parseInt(
			(new Date(todayF) - new Date(finalF)) / (1000 * 60 * 60 * 24),
			10
		);

		if (dif === 0) {
			return `Hoje`;
		}
		if (dif === 1) {
			return `Ontem`;
		}
		if (dif <= 7) {
			return `Nos últimos 7 dias`;
		}
		return `há ${dif} dias`;
	};

	const produtosText = (prods) => {
		return (newProd = prods?.map((data, i) => {
			const sep = i + 1 < prods?.length ? " - " : "";
			return data + sep;
		}));
	};
	return (
		<>
			<View style={styles.mainContainer}>
				<View style={{ flexDirection: "row" }}>
					<View style={styles.dateImgContainer}>
						<View>
							<Image style={styles.image} source={sourceImage} />
						</View>
						<View>
							<Text style={styles.dateText}>
								{formatDateFirebase(createdAt)}
							</Text>
						</View>
					</View>
					<View style={styles.sellerDataContainer}>
						<View>
							<Text style={{ fontWeight: "bold" }}>
								{sellerName?.toUpperCase()}
							</Text>
							<Text style={{ fontSize: 8 }}>{clientMail}</Text>
						</View>
						<View>
							<Text style={{ fontSize: 8, fontWeight: 600 }}>
								{produtosText(prodctsSell)}
							</Text>
						</View>
					</View>
				</View>

				<View style={styles.valueButton}>
					<Button
						icon={urlComp && "receipt"}
						mode="text"
						onPress={handlePressUrl.bind(this, urlComp)}
						disabled={!urlComp && true}
						contentStyle={{
							flexDirection: "row-reverse"
							// backgroundColor: "#rgba(11,156,49,0.8)"
						}}
					>
						<Text style={{ color: "black" }}>
							R${" "}
							{parseFloat(value).toLocaleString("pt-br", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})}
						</Text>
					</Button>
					<Text style={{ fontSize: 8 }}>{getData(createdAt)}</Text>
				</View>
			</View>
			<Divider width="100%" />
		</>
	);
};

export default CardVendas;

const styles = StyleSheet.create({
	sellerDataContainer: {
		justifyContent: "space-between",
		marginLeft: 15,
		alignItems: "flex-start",
		paddingBottom: 4
	},
	valueButton: {
		justifyContent: "flex-end",
		alignItems: "flex-end"
	},
	dateImgContainer: {
		justifyContent: "center",
		alignItems: "center"
	},
	mainContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center"
	},
	dateText: {
		color: "grey",
		fontSize: 9,
		marginTop: 3,
		marginBottom: 5
	},
	image: {
		width: 30,
		height: 30,
		marginRight: 15
	}
});
