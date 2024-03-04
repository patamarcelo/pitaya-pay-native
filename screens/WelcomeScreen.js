import { StyleSheet, Text, View, Image, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { userSelector } from "../store/redux/selector";

import { getContractsSign } from "../utils/firebase/firebase.datatable";
import { useState, useEffect } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";

import { storage } from "../utils/firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";

import { Skeleton, LinearGradient } from "@rneui/themed";
import { useIsFocused } from "@react-navigation/native";

function WelcomeScreen() {
	const user = useSelector(userSelector);
	const storageRef = ref(storage, `img/promo.jpeg`);

	const [pictureUrl, setPictureUrl] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const [showImg, setShowImg] = useState(false);
	const [localImg, setlocalImg] = useState(false);
	const [isError, setisError] = useState(false);

	const isFocused = useIsFocused();

	useEffect(() => {
		setisError(false);
	}, [isFocused]);

	useEffect(() => {
		try {
			getDownloadURL(storageRef)
				.then((downloadURL) => {
					setPictureUrl(downloadURL);
				})
				.catch((err) => {
					console.log("erro ao pegar a img", err);
					setlocalImg(true);
					setisError(true);
				});
		} catch (err) {
			console.log("Erro ao gerar a Imagem", err);
			setIsLoading(false);
			setisError(true);
			pictureUrl(null);
		} finally {
			console.log("imagem caregada");
			console.log(isLoading);
		}
		console.log("here, :", pictureUrl);
	}, [storageRef, isFocused]);

	if (!isError) {
		return (
			<>
				{isLoading && (
					<SafeAreaView
						style={{
							flex: 1,
							minHeight: '90%',
							justifyContent: "center",
							// alignItems: "start"
						}}
					>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								width: "100%",
								marginTop: 20
							}}
						>
							<Skeleton
								width={"80%"}
								height={35}
								LinearGradientComponent={LinearGradient}
								animation="wave"
							/>
						</View>
						<View
							style={{
								flex: 12,
								justifyContent: "center",
								alignItems: "center",
								width: "100%"
							}}
						>
							<Skeleton
								width={"95%"}
								height={"80%"}
								LinearGradientComponent={LinearGradient}
								animation="wave"
							/>
						</View>
					</SafeAreaView>
				)}
				<View style={[styles.rootContainer, {flex: !isLoading ? 1 : 0}]}>
					<Image
						source={{ uri: pictureUrl }}
						style={styles.imgContainer}
						onLoadStart={() => setIsLoading(true)}
						onLoadEnd={() => setIsLoading(false)}
					/>
				</View>
			</>
		);
	}

	return (
		<View style={styles.rootContainer}>
			{/* {!showImg && isLoading && (
				<View style={{ marginTop: 400 }}>
					<LoadingOverlay style={{ color: "black" }} color="black" />
				</View>
			)} */}
			{!isError && (
				<Image
					source={{ uri: pictureUrl }}
					style={styles.imgContainer}
					onLoad={() => setShowImg(true)}
				/>
			)}
			{localImg && isError && (
				<Image
					source={(source = require("../assets/promo.jpg"))}
					style={styles.imgContainer}
				/>
			)}
		</View>
	);
}

export default WelcomeScreen;

const styles = StyleSheet.create({
	imgContainer: {
		width: "100%",
		height: "100%"
	},
	rootContainer: {
		justifyContent: "center",
		alignItems: "center"
		// padding: 32
	},
	title: {
		fontSize: 20,
		fontWeight: "bold"
		// marginBottom: 8
	}
});
