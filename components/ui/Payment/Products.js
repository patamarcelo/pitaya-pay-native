import {
	Text,
	View,
	StyleSheet,
	Pressable,
	ActivityIndicator,
	Animated,
	Alert
} from "react-native";
import { Colors } from "../../../constants/styles";
import { createDjangoClient } from "../../../utils/axios/axios.utils";
import { useState, useEffect, useCallback } from "react";

import MultiSelect from "react-native-multiple-select";
import { FontAwesome } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { Divider } from "react-native-paper";
import { Dimensions } from "react-native";

import {
	userSelector,
} from "../../../store/redux/selector";
import { useSelector } from "react-redux";

import { useNavigation, useRoute } from "@react-navigation/native";

import Icon from "react-native-vector-icons/FontAwesome";
import * as Haptics from 'expo-haptics';



const width = Dimensions.get("window").width; //full width

const ProductsComp = (props) => {
	const [isLoading, setIsLoading] = useState(false);
	const [altura, setAltura] = useState(new Animated.Value(120));
	const [largura, setLargura] = useState(new Animated.Value(0));
	const user = useSelector(userSelector);
	const navigation = useNavigation();
	const route = useRoute();


	const {
		products,
		setProducts,
		productsComp,
		setProductsComp,
		parcelasSelected,
		setParcelasSelected,
		handlerChangeParcelas,
		handleDeleteProduct,
		paymentValue,
		quantityProd
	} = props;
	const getW = width - (width * 0, 10);
	useEffect(() => {
		if (products.length > 0) {
			Animated.sequence([
				Animated.timing(largura, {
					toValue: getW,
					duration: 200,
					useNativeDriver: false
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
		return productsComp.find((data) => data.id === product);
	};

	useEffect(() => {
		const getProductsQuery = async () => {
			setIsLoading(true);
			try {
				const
					res
						= await createDjangoClient.post("products/register_prods/get_kitprods_open_byseller_rnapp/",
							{ 'seller_email': user.email }
							// { 'seller_email': 'gayerale78@gmail.com' }
						);
				if (res.status === 200) {
					const kitProdsResp = res.data.dados

					console.log('data', res.data.dados.data)
					console.log('res', res, '\n')
					const formatedArr = kitProdsResp.data.map((data) => {
						console.log('data here: ', data)
						return {
							id: data.product_id_produto,
							model: data.content_type__model,
							value: data?.sell_price,
							name: data.product_id_produto,
							pk: data.pk
						};
					});
					console.log('\n')
					if (kitProdsResp.data.length === 0) {
						Alert.alert('Sem Kit Liberado!!', 'Sem produtos disponíveis, contatar a Administração.',
						[
							{ text: "OK", onPress: () => navigation.goBack() } // 👈 This goes back
						]
						)
					}
					setProductsComp(formatedArr);
					setProducts(kitProdsResp);
				}
			} catch (error) {
				console.log("erro ao pegar os produtos", error);
			} finally {
				setIsLoading(false);
			}
		};
		getProductsQuery();
	}, []);


	const formatNumber = number => {
		if (!number) return 0
		return number?.toLocaleString("pt-br", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	}
	const handleSelect = (prod) => {
		console.log('products: ', products)
		console.log('parcelasSelected: ', parcelasSelected)
		const dataToSend = {
			// data: products, existProds: parcelasSelected
			data: products, existProds: parcelasSelected
		}
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		navigation.navigate("ProdutosStack", {
			data: dataToSend,
			onGoBack: (data) => {
				console.log('data received here', data);
				setParcelasSelected(data);
			},
		});

		// navigation.push("ProdutosStack", { data: products })
	}

	if(productsComp.length === 0 && !isLoading){
		return 
	}

	return isLoading ? (
		<View style={styles.loaderContainer}>
			<ActivityIndicator size="large" color={"whitesmoke"} />
		</View>
	) : (
		<View
			style={[
				styles.mainContainer,
				{ paddingBottom: parcelasSelected.length > 0 ? 20 : 0 }
			]}
		>
			{/* <View style={styles.mainContainer}> */}
			<Pressable
				onPress={handleSelect.bind(this, 'select-produtos')}
				style={({ pressed }) => [
					pressed && styles.pressed,
					styles.selectContainer
				]}>
				<Text style={styles.selectTitle}>Selecionar Produtos</Text>
				<Icon name="chevron-right" size={18} color={Colors.gold[100]} />
			</Pressable>
			{/* </View> */}

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
									<Pressable
										onPress={handleDeleteProduct.bind(
											this,
											data
										)}
										style={({ pressed }) => [
											pressed && styles.pressed,
											{ justifyContent: 'space-between', flexDirection: 'row', width: '100%', paddingRight: 20 }
										]}


									>
										<Text style={styles.dataContent}>
											{getProduct(data.product_id_produto)?.name}
										</Text>
										<Text style={styles.dataContent}>
											{getProduct(data.product_id_produto)?.model.charAt(0).toUpperCase() + getProduct(data.product_id_produto)?.model.slice(1)}
										</Text>
										<Text style={styles.dataContent}>
											R$ {formatNumber(getProduct(data.product_id_produto)?.value)}
										</Text>
									</Pressable>
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
							<Text style={styles.itemText}>
								{quantityProd > 1
									? `Items: ${quantityProd}`
									: `Item: ${quantityProd}`}
							</Text>
							<Text style={styles.valueText}>
								R$ {" "}
								{paymentValue && paymentValue > 0
									? paymentValue.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})
									: "0,00"}
							</Text>
						</View>
					</>
				)}
			</View>
		</View>
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
		paddingHorizontal: 10,
		paddingTop: 10,
		paddingBottom: 5
	},
	loaderContainer: {
		marginVertical: 70
	},
	mainDataViewContainer: {
		backgroundColor: Colors.primary[600],
		borderRadius: 6,
		paddingVertical: 5,
	},
	multiContainer: {
		width: "90%"
	},
	selectContainer: {
		width: '100%',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center'
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
		justifyContent: "space-between",
		alignItems: "center",
		marginRight: 10
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
		alignItems: "center",
		justifyContent: 'center',
		borderRadius: 6,
		paddingHorizontal: 10,
		marginHorizontal: 10,
	},
	selectTitle: {
		color: Colors.gold[100],
		fontSize: 20,
		fontWeight: 'bold',
		paddingVertical: 20,
		textAlign: 'left'
	}
});
