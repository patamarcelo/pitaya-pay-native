import { View, Text, Image, StyleSheet } from "react-native";
import { Button, Divider } from "react-native-paper";

import { ICON_URL } from "../../utils/imageUrl";
import { formatDateFirebase } from "../../utils/formatDate";

const CardVendas = ({ data, handlePressUrl }) => {
	const { type, createdAt, value, prodctsSell, compUrl } = data;
	const sourceImage = type ? ICON_URL[type].uri : "";
	const urlComp = compUrl?.length > 5 ? compUrl : null;
	let products = null;
	// if (prodctsSell) {
	// 	// products = prodctsSell?.split(" ").join(" - ");
	// 	console.log(typeof prodctsSell);
	// }

	return (
		<>
			<View style={styles.mainContainer}>
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
				<View>
					<Text>{products}</Text>
				</View>
				{/* <View>
					<Text>
						R${" "}
						{parseFloat(value).toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</Text>
				</View> */}
				<View>
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
				</View>
			</View>
			<Divider width="100%" />
		</>
	);
};

export default CardVendas;

const styles = StyleSheet.create({
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
