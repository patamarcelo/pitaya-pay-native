import {
	Text,
	View,
	StyleSheet,
	Pressable,
	ActivityIndicator,
	Animated
} from "react-native";
import { Colors } from "../../../constants/styles";
import { createClient } from "../../../utils/axios/axios.utils";
import { useState, useEffect } from "react";

import MultiSelect from "react-native-multiple-select";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { Divider } from "react-native-paper";
import { Dimensions } from "react-native";

const width = Dimensions.get("window").width; //full width

const ProductsComp = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [altura, setAltura] = useState(new Animated.Value(120));
	const [largura, setLargura] = useState(new Animated.Value(0));

	const {
		products,
		setProducts,
		productsComp,
		setProductsComp,
		parcelasSelected,
		setParcelasSelected,
		handlerChangeParcelas,
		handleDeleteProduct
	} = props;
	const getW = width - (width * 0, 10);
	useEffect(() => {
		if (products.length > 0) {
			Animated.sequence([
				Animated.timing(largura, {
					toValue: getW,
					duration: 200
					// useNativeDriver: true
				})
				// Animated.timing(altura, {
				// 	toValue: 150,
				// 	duration: 100
				// 	// useNativeDriver: true
				// })
			]).start();
		}
	}, [products]);

	const getProduct = (product) => {
		return productsComp.filter((data) => data.id === product)[0].name;
	};

	const getProductsQuery = async () => {
		setIsLoading(true);
		try {
			const {
				data: { data }
			} = await createClient("pitaya-products", null, {});
			console.log(data);
			const formatedArr = data.map((data) => {
				return {
					id: data.codigo,
					name: `${data.codigo} - ${
						data.tipo
					} - R$ ${data?.valor?.toLocaleString("pt-br", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}`
				};
			});
			setProductsComp(formatedArr);
			setProducts(data);
		} catch (error) {
			console.log("erro ao pegar os produtos", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getProductsQuery();
	}, []);

	return isLoading ? (
		<View style={styles.loaderContainer}>
			<ActivityIndicator size="large" />
		</View>
	) : (
		<Animated.View
			style={[
				styles.mainContainer,
				{ width: largura, minHeight: altura }
			]}
		>
			<View style={styles.titleView}>
				<Text style={styles.title}>Selecione pelo menos 1 produto</Text>
			</View>
			<View style={styles.multiContainer}>
				<MultiSelect
					hideTags
					items={productsComp}
					uniqueKey="id"
					ref={(component) => {
						this.multiSelect = component;
					}}
					onSelectedItemsChange={handlerChangeParcelas}
					selectedItems={parcelasSelected}
					selectText="Selecione os Produtos"
					searchInputPlaceholderText="Procure os produtos"
					onChangeInput={(text) => console.log(text)}
					// altFontFamily="ProximaNova-Light"
					tagRemoveIconColor="#CCC"
					tagBorderColor="white"
					tagTextColor="white"
					selectedItemTextColor="#CCC"
					selectedItemIconColor="#CCC"
					itemTextColor="#000"
					displayKey="name"
					styleDropdownMenu={{ backgroundColor: Colors.primary[800] }}
					styleMainWrapper={{ backgroundColor: Colors.primary[800] }}
					searchInputStyle={{
						color: "#CCC",
						padding: 8
					}}
					submitButtonColor="black"
					submitButtonText="Confirmar"
					styleDropdownMenuSubsection={{
						borderRadius: 8
						// backgroundColor: Colors.primary500
					}}
					styleTextDropdown={{
						paddingHorizontal: 8
					}}
					styleTextDropdownSelected={{
						paddingHorizontal: 8
					}}
					// styleDropdownMenu={{ marginTop: 8 }}
					styleIndicator={{ bottom: 5, left: 10 }}
					// tagContainerStyle={{
					// 	borderRadius: 8
					// }}
					// styleItemsContainer={
					// 	{
					// 		// maxHeightheight: "80%"
					// 	}
					// }
				/>
			</View>

			<View style={styles.mainDataViewContainer}>
				{parcelasSelected &&
					parcelasSelected.map((data, i) => {
						return (
							<View key={i} style={styles.productContainer}>
								<View style={styles.productContainerInside}>
									<FontAwesome
										name="check-square-o"
										size={20}
										color={Colors.succes[300]}
									/>
									<Text style={styles.dataContent}>
										{getProduct(data)}
									</Text>
								</View>
								<Pressable
									onPress={handleDeleteProduct.bind(
										this,
										data
									)}
									style={({ pressed }) => [
										pressed && styles.pressed
									]}
								>
									<Ionicons
										name="trash-bin"
										size={20}
										color={Colors.error[500]}
									/>
								</Pressable>
							</View>
						);
					})}
				{parcelasSelected.length > 0 && (
					<>
						<Divider />
						<View style={styles.resumContainer}>
							<Text style={styles.itemText}>Item: 1</Text>
							<Text style={styles.valueText}>
								Subtotal: R$ 20,00
							</Text>
						</View>
					</>
				)}
			</View>
		</Animated.View>
	);
};

export default ProductsComp;

const styles = StyleSheet.create({
	itemText: {
		color: Colors.secondary[200]
	},
	valueText: {
		color: Colors.secondary[200]
	},
	resumContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingTop: 10,
		paddingBottom: 5
	},
	loaderContainer: {
		marginVertical: 70
	},
	mainDataViewContainer: {
		backgroundColor: Colors.primary[600],
		borderRadius: 8,
		paddingVertical: 5
	},
	multiContainer: {
		width: "94%"
	},
	titleView: {
		marginVertical: 10
	},
	title: {
		alignSelf: "center",
		color: Colors.gold[100],
		fontStyle: "italic"
	},
	pressed: {
		opacity: 0.5
	},
	dataContent: {
		marginLeft: 20,
		color: "whitesmoke"
	},
	productContainerInside: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center"
	},
	productContainer: {
		width: "90%",
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 8,
		marginHorizontal: 10
	},
	mainContainer: {
		width: "95%",
		backgroundColor: Colors.primary[800],
		paddingBottom: 20,
		alignItems: "center",
		borderRadius: 12
		// alignItems: "center"
		// backgroundColor: Colors.secondary[200]
	}
});
