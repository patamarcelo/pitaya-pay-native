import { StyleSheet, Text, View, Image } from "react-native";
import { useSelector } from "react-redux";
import { userSelector } from "../store/redux/selector";

import { getContractsSign } from "../utils/firebase/firebase.datatable";
import { useState, useEffect } from "react";
import LoadingOverlay from "../components/ui/LoadingOverlay";

import { storage } from "../utils/firebase/firebase";
import { ref, getDownloadURL } from "firebase/storage";

import { Skeleton } from "@rneui/themed";

function WelcomeScreen() {
	const user = useSelector(userSelector);
	const storageRef = ref(storage, `img/promo.jpg`);
	const [pictureUrl, setPictureUrl] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [showImg, setShowImg] = useState(false);
	const [localImg, setlocalImg] = useState(false);
	const [isError, setisError] = useState(false);

	useEffect(() => {
		setIsLoading(true);
		try {
			getDownloadURL(storageRef)
				.then((downloadURL) => {
					setPictureUrl(downloadURL);
				})
				.catch((err) => {
					console.log("erro ao pegar a img", err);
					setlocalImg(true);
					setIsLoading(false);
					setisError(true);
				});
		} catch (err) {
			console.log("Erro ao gerar a Imagem", err);
			setisError(true);
			pictureUrl(null);
		} finally {
			setIsLoading(false);
		}
	}, [storageRef]);

	if (isLoading) {
		return (
			<LoadingOverlay
				style={{ color: "black" }}
				message={"Carregando..."}
			/>
		);
	}

	return (
		<View style={styles.rootContainer}>
			{!showImg && isLoading && (
				<View style={{ marginTop: 400 }}>
					<LoadingOverlay style={{ color: "black" }} color="black" />
				</View>
			)}
			{!localImg && !isError && (
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
		flex: 1,
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
