import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-paper";

import { ICON_URL } from "../../utils/imageUrl";
import { formatDateFirebase } from "../../utils/formatDate";

const CardVendas = ({ data, handlePressUrl }) => {
	console.log(data);
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
		if (dataVenda === 1) {
			return `ontem`;
		}
	};

	// const todayDate = new Date();
	// const todayD = todayDate.toLocaleString("pt-BR");
	// const finalD = formatDateFirebase(createdAt);

	const produtosText = (prods) => {
		console.log(prods.length);
		return (newProd = prods.map((data, i) => {
			const sep = i + 1 < prods.length ? " - " : "";
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
								{sellerName.toUpperCase()}
							</Text>
							<Text style={{ fontSize: 8 }}>{clientMail}</Text>
						</View>
						<View>
							<Text style={{ fontSize: 8 }}>
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
					<Text style={{ fontSize: 8 }}>{getData(1)}</Text>
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
