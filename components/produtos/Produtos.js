import { StyleSheet, Text, View, FlatList, SafeAreaView, Pressable, ScrollView } from 'react-native'
import { KeyboardAvoidingView, Platform } from "react-native";
import { useLayoutEffect, useState, useEffect } from 'react';
import IconButton from '../ui/IconButton';
import Button from '../ui/Button';
import { Colors } from '../../constants/styles'

import * as Haptics from 'expo-haptics';

import { Ionicons } from "@expo/vector-icons";

import ProdutoCard from './ProdutoCard';
const ProdutosScreen = ({ navigation, route }) => {

	// const { data } = route?.params
	const handleBack = () => {
		navigation.goBack();
	};
	const prods = route?.params?.data?.data?.data
	const existentProds = route?.params?.data?.existProds




	const [filterProdsHeader, setFilterProdsHeader] = useState([]);
	const [selectedFilterPod, setSelectedFilterPod] = useState("Todos");

	const [selectProdsList, setSelectProdsList] = useState([]);
	const [resumeCardReducer, setResumeCardReducer] = useState([]);
	useEffect(() => {
		if (selectProdsList?.length > 0) {
			const groupedData = Object.values(
				selectProdsList.reduce((acc, item) => {
					const model = item.content_type__model;
					if (!acc[model]) {
						acc[model] = { model, quant: 0 };
					}
					acc[model].quant += 1;
					return acc;
				}, {})
			);
			setResumeCardReducer(groupedData)
		}
	}, [selectProdsList]);

	useEffect(() => {
		if (prods?.length > 0) {
			const onlyprods = prods.map((data) => data.content_type__model).sort((a,b) => a.localeCompare(b))
			const removeDupliProds = [... new Set(['Todos', ...onlyprods])]
			setFilterProdsHeader(removeDupliProds)
		}
	}, [prods]);

	useEffect(() => {
		setSelectProdsList(existentProds || [])
	}, []);

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "Produtos",
			headerTintColor: 'whitesmoke',
			headerShadowVisible: false,
			headerShown: true,
			contentStyle: { backgroundColor: Colors.primary500 },
			headerLeft: ({ tintColor }) => (
				<IconButton
					icon="arrow-back"
					color={tintColor}
					size={24}
					onPress={handleBack}
				/>
			)
		});
	}, []);

	const handleSelectProds = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		console.log('selected Prods: ')
		// Set params before going back
		const { onGoBack } = route.params; // Retrieve the callback function
		if (onGoBack) {
			onGoBack(selectProdsList || []); // Send data back
		}
		navigation.goBack(); // Navigate back to the previous screen
	}


	const handleFilterProds = (data) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		console.log('filter Prods: ', data)
		setSelectedFilterPod(data)
	}

	const handleDeleteProduct = (model) => {
		setSelectProdsList((prev) => {
			console.log('prev', prev)
			console.log('prevModel', model)
			return prev.filter((data) => data.content_type__model !== model.model)
		})
	}


	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: "rgba(243,206,224,0.1)" }}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={{ flex: 1 }}
			>
				<ScrollView
					horizontal={true}
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={styles.containerFilter}
				>
					{filterProdsHeader?.map((data, i) => (
						<Pressable
							style={({ pressed }) => [
								styles.pressableContainer,
								pressed && styles.pressed,
								{ backgroundColor: data === selectedFilterPod ? Colors.succes[300] : Colors.secondary[200] }
							]}
							key={i}
							onPress={handleFilterProds.bind(this, data)}
						>
							<Text style={styles.textFilter}>  {data.charAt(0).toUpperCase() + data.slice(1)}
							</Text>
						</Pressable>
					))}
				</ScrollView>
				<FlatList
					contentInsetAdjustmentBehavior="automatic" // Helps auto-hide the large title
					scrollEnabled={true}
					data={selectedFilterPod === 'Todos' ? prods.sort((a,b) => Number(a.product_id_produto) - Number(b.product_id_produto)) : prods.sort((a,b) => Number(a.product_id_produto) - Number(b.product_id_produto)).filter((data) => data.content_type__model === selectedFilterPod)}
					keyExtractor={(item, i) => item.product_id_produto + i}
					renderItem={({ item }) => (
						<ProdutoCard
							item={item}
							setSelectProdsList={setSelectProdsList}
							selectProdsList={selectProdsList || []}
						/>
					)}
					// ItemSeparatorComponent={() => <View style={{ height: 0 }} />}
					ListFooterComponent={<View style={{ height: 40 }} />}
				/>
				<View style={[styles.buttonContainer, { paddingHorizontal: 10, paddingTop: 10, marginBottom: -40 }]}>

					{
						selectProdsList.length > 0 && (
							resumeCardReducer.map((data, i) => {
								return (

									<View key={i} style={[styles.resumeContainer, { marginTop: i === 0 ? 10 : 0 }]}>
										<View style={{ flexDirection: 'row', width: 120, justifyContent: 'space-between' }}>
											<Text style={{ fontWeight: 'bold', color: Colors.secondary[200] }}>{data?.model.charAt(0).toUpperCase() + data?.model?.slice(1)}</Text>
											<Text style={{ fontWeight: 'bold', color: Colors.secondary[300] }}>{data?.quant}</Text>
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
												color={Colors.error[300]}
											/>
										</Pressable>
									</View>
								)
							})

						)
					}

					{
						selectProdsList.length > 0 && (
							<View style={{ height: 1, backgroundColor: 'gray', marginVertical: 10 }} />
						)
					}
					{
						selectProdsList.length === 0 ?
							<Button
								btnStyles={{
									backgroundColor: Colors.gold[600],
								}}
								onPress={handleBack}>Voltar</Button>
							:
							<Button onPress={handleSelectProds}>Confirmar</Button>
					}

				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
}

export default ProdutosScreen

const styles = StyleSheet.create({
	resumeContainer: {
		flexDirection: 'row',
		marginBottom: 10,
		// gap: 40,
		width: 250,
		justifyContent: 'space-between',
	},
	buttonContainer: {
		backgroundColor: 'rgba(123,123,123,0.5)',
		// backgroundColor: 'rgba(195,11,100,0.4)',
		// opacity: 0.3,
		borderTopRightRadius: 12,
		borderTopLeftRadius: 12,
		paddingBottom: 40,
	},
	textFilter: {
		fontSize: 14,
		fontWeight: 'bold',
	},
	pressableContainer: {
		backgroundColor: Colors.secondary[200],
		height: 30,
		marginBottom: 20,
		paddingHorizontal: 15, // Adds better spacing on the sides
		borderRadius: 10,
		alignItems: 'center', // Centers the text inside the button
		justifyContent: 'center', // Ensures text is vertically aligned
	},
	containerFilter: {
		flexDirection: 'row',
		gap: 10,
		marginHorizontal: 10,
		paddingRight: 10,

	},
	pressed: {
		opacity: 0.7,
	}
})