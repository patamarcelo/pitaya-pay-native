import { View, StyleSheet, Text, Image, Pressable } from "react-native";
import { ICON_URL } from "../../utils/imageUrl";
import { Colors } from "../../constants/styles";
import { useNavigation } from "@react-navigation/native";

import Animated, { BounceIn, BounceOut, FadeIn, FadeInRight,FadeOutRight, FadeInUp, FadeOut, FadeOutUp, FlipInEasyX, FlipOutEasyX, Layout, SlideInLeft, SlideInRight, SlideOutRight, SlideOutUp, StretchInY, StretchOutX, ZoomIn, ZoomOut } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
const CardButton = (props) => {
	const { type, nextUrl, textTitle, btnStyles } = props;
	const sourceImage = type ? ICON_URL[type].uri : "";
	const sourceText = type ? ICON_URL[type].title : textTitle;

	const navigation = useNavigation();

	const handlePress = () => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
		navigation.navigate(nextUrl);
	};
	return (
		<Animated.View
			entering={FadeInRight.duration(500)} // Root-level animation for appearance
			exiting={FadeOutRight.duration(500)} // Root-level animation for disappearance
			layout={Layout.springify()}    // 
			style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}
		>

			<Pressable
				style={({ pressed }) => [
					styles.mainContainer,
					pressed && styles.pressed,
					type === 'linkPay' && styles.linkPayContainer,
					btnStyles
				]}
				onPress={handlePress}
			>
				{type && <Image style={[styles.image, type === 'linkPay' && styles.linkPayImg]} source={sourceImage} />}
				<Text style={styles.text}>{sourceText}</Text>
			</Pressable>
		</Animated.View>
	);
};

export default CardButton;

const styles = StyleSheet.create({
	pressed: {
		opacity: 0.75
	},
	mainContainer: {
		flexDirection: "row",
		width: "100%",
		justifyContent: "center",
		alignItems: "center",
		borderColor: "black",
		backgroundColor: Colors.secondary[100],
		paddingVertical: 10,

		elevation: 9,

		shadowColor: "black",
		shadowOpacity: 0.8,
		shadowOffset: { width: 2, height: 4 },
		shadowRadius: 2,
		borderRadius: 20
	},
	linkPayContainer: {
		height: 68
	},
	linkPayImg: {
		width: 20,
		height: 20,
		marginRight: 15
	},
	image: {
		width: 50,
		height: 50,
		marginRight: 15
	},
	text: {
		fontSize: 18,
		fontWeight: "600",
		fontStyle: "italic"
	}
});
