import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import NewPassword from "./screens/NewPassword";
import WelcomeScreen from "./screens/WelcomeScreen";
import PaymentScreen from "./screens/PaymentScreen";
import UserScreen from "./screens/UserScreen";

import { Colors } from "./constants/styles";
import AuthContextprovider, { AuthContext } from "./store/auth-context";
import AuthContent from "./components/Auth/AuthContent";
import { useContext, useEffect, useLayoutEffect, useState } from "react";

import IconButton from "./components/ui/IconButton";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome5 } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLoading from "expo-app-loading";

import PixComponent from "./components/pix/Pix";
import PixMailComponent from "./components/pix/PixMail";
import CreditCardComponent from "./components/credit-card/CreditCard";
import { useNavigation } from "@react-navigation/native";

import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import ConfirmationPix from "./components/pix/PixConfirmation";
import ServiceTerms from "./components/terms/ServiceTerms";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/redux/store";
import { Text, StyleSheet, View } from "react-native";

import { useSelector, useDispatch } from "react-redux";
import { termsSelector, userSelector } from "./store/redux/selector";
import { userActions } from "./store/redux/usuario";

import { getContractsSign } from "./utils/firebase/firebase.datatable";
import { FontAwesome } from "@expo/vector-icons";

import LoadingOverlay from "./components/ui/LoadingOverlay";

import {
	onAuthStateChangedListener,
	signOutUser
} from "./utils/firebase/firebase";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthStack() {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "white",
				contentStyle: { backgroundColor: Colors.primary100 }
			}}
		>
			<Stack.Screen
				name="Login"
				component={LoginScreen}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
			<Stack.Screen
				name="NewPassword"
				component={NewPassword}
				options={{
					presentation: "modal",
					title: "Redefinir a Senha",
					contentStyle: {
						backgroundColor: Colors.primary[900]
					}
				}}
			/>
		</Stack.Navigator>
	);
}

function PixStack({ navigation }) {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 }
			}}
		>
			<Stack.Screen name="PIX" component={PixComponent} />
			<Stack.Screen name="PIXMAIL" component={PixMailComponent} />
			<Stack.Screen name="PIXCONFIRMATION" component={ConfirmationPix} />
		</Stack.Navigator>
	);
}

function CartaoStack({ navigation }) {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 }
			}}
		>
			<Stack.Screen name="CARTAO" component={CreditCardComponent} />
		</Stack.Navigator>
	);
}
function PaymentStack({ route, navigation }) {
	return (
		<Stack.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 }
			}}
		>
			<Stack.Screen
				name="Pagamentos"
				component={PaymentScreen}
				options={{
					headerShown: false,
					contentStyle: { backgroundColor: Colors.primary500 }
				}}
			/>
		</Stack.Navigator>
	);
}

function HomeStack() {
	const context = useContext(AuthContext);

	const handlerLogout = () => {
		signOutUser();
		context.logout();
	};
	return (
		<Tab.Navigator
			screenOptions={{
				headerStyle: { backgroundColor: Colors.primary500 },
				headerTintColor: "white",
				contentStyle: { backgroundColor: Colors.primary100 }
			}}
		>
			<Tab.Screen
				name="Home"
				component={WelcomeScreen}
				options={{
					title: "Seja Bem Vindo",
					headerRight: ({ tintColor }) => (
						<IconButton
							type={"awesome"}
							icon="power-off"
							color={tintColor}
							size={22}
							onPress={handlerLogout}
							btnStyles={{ marginRight: 15 }}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home" color={color} size={size} />
					)
				}}
			/>
			<Tab.Screen
				name="PagamentosTab"
				component={PaymentStack}
				options={{
					title: "Pagamentos",
					headerShown: false,
					tabBarLabel: "Pagamentos",
					// tabBarStyle: { display: "none" },
					headerRight: ({ tintColor }) => (
						<IconButton
							icon="exit"
							color={tintColor}
							size={24}
							onPress={() => navigation.navigate("Welcome")}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="money-check"
							size={size}
							color={color}
						/>
					)
				}}
			/>
			<Tab.Screen
				name="Usuário"
				component={UserScreen}
				options={{
					// headerRight: ({ tintColor }) => (
					// 	<IconButton
					// 		icon="exit"
					// 		color={tintColor}
					// 		size={24}
					// 		onPress={context.logout}
					// 	/>
					// ),
					tabBarIcon: ({ color, size }) => (
						<FontAwesome5
							name="user-alt"
							size={size}
							color={color}
						/>
					)
				}}
			/>
		</Tab.Navigator>
	);
}

function AuthenticatedStack(props) {
	const { context } = props;
	const navigation = useNavigation();
	const user = useSelector(userSelector);
	const [agree, setAgree] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const agreedTerms = useSelector(termsSelector);

	const handlerLogout = () => {
		signOutUser();
		context.logout();
	};

	const getAllusers = async () => {
		setIsLoading(true);
		if (!agreedTerms) {
			try {
				const allUsers = await getContractsSign();
				console.log(user);
				const confirmArr = allUsers.filter(
					(allUser) => allUser.id === user.uid
				);
				console.log("afred Terms: ", confirmArr);
				if (confirmArr.length > 0) {
					setAgree(true);
					dispatch(userActions.registerTerms());
				} else {
					setAgree(false);
					dispatch(userActions.unregisterTerms());
				}
				setIsLoading(false);
			} catch (error) {
				console.log("erro em gerar os dados", error);
				// signOutUser();
			} finally {
				setIsLoading(false);
			}
		} else {
			setAgree(true);
			setIsLoading(false);
		}
	};

	useLayoutEffect(() => {
		getAllusers();
	}, []);

	if (isLoading) {
		return (
			<View style={styles.loadingContainer}>
				<LoadingOverlay message={"Conectando você..."} />
			</View>
		);
	}

	return (
		<>
			{agreedTerms ? (
				<Stack.Navigator
					screenOptions={{
						headerShown: false,
						headerStyle: { backgroundColor: Colors.primary500 },
						headerTintColor: "white",
						contentStyle: { backgroundColor: Colors.secondary[100] }
					}}
				>
					<Stack.Screen
						name="Welcome"
						component={HomeStack}
						options={{
							headerRight: ({ tintColor }) => (
								<IconButton
									icon="exit"
									color={tintColor}
									size={24}
									onPress={handlerLogout}
								/>
							),
							tabBarIcon: ({ color, size }) => (
								<Ionicons
									name="home"
									color={color}
									size={size}
								/>
							)
						}}
					/>
					<Stack.Screen
						name="pixStack"
						component={PixStack}
						options={{
							title: "Pagamentos",
							headerShown: false,
							tabBarLabel: "Pagamentos",
							// tabBarStyle: { display: "none" },
							headerRight: ({ tintColor }) => (
								<IconButton
									icon="exit"
									color={tintColor}
									size={24}
									onPress={() =>
										navigation.navigate("Welcome")
									}
								/>
							),
							tabBarIcon: ({ color, size }) => (
								<FontAwesome5
									name="money-check"
									size={size}
									color={color}
								/>
							)
						}}
					/>
					<Stack.Screen
						name="cartaoStack"
						component={CartaoStack}
						options={{
							title: "cartao",
							headerShown: false,
							// tabBarLabel: "Cartão",
							// tabBarStyle: { display: "none" },
							headerRight: ({ tintColor }) => (
								<IconButton
									icon="exit"
									color={tintColor}
									size={24}
									onPress={() =>
										navigation.navigate("Welcome")
									}
								/>
							),
							tabBarIcon: ({ color, size }) => (
								<FontAwesome5
									name="money-check"
									size={size}
									color={color}
								/>
							)
						}}
					/>
					<Stack.Screen
						name="ServiceTerms"
						component={ServiceTerms}
						options={{
							title: "Termos de Serviço",
							headerShown: true
						}}
					/>
				</Stack.Navigator>
			) : (
				<Stack.Navigator
					screenOptions={{
						headerStyle: { backgroundColor: Colors.primary500 },
						headerTintColor: "white",
						contentStyle: { backgroundColor: Colors.primary100 },
						backgroundColor: "whitesmoke"
					}}
				>
					<Stack.Screen
						name="registerTerms"
						component={ServiceTerms}
						options={{
							title: "Termos de Serviço",
							headerRight: ({ tintColor }) => (
								<IconButton
									icon="exit"
									color={tintColor}
									size={24}
									onPress={handlerLogout}
								/>
							)
						}}
					/>
				</Stack.Navigator>
			)}
		</>
	);
}

function Navigation() {
	const context = useContext(AuthContext);
	const user = useSelector(userSelector);
	const dispatch = useDispatch();
	const { setUser } = userActions;

	useEffect(() => {
		const unsubscribe = onAuthStateChangedListener((user) => {
			if (user) {
				context.authenticate(user.accessToken);
				console.log("userDispatch", user);
				dispatch(setUser(user));
			}
		});
		return unsubscribe;
	}, [dispatch]);

	return (
		<NavigationContainer>
			{!context.isAuth ? (
				<AuthStack />
			) : (
				<AuthenticatedStack context={context} />
			)}
		</NavigationContainer>
	);
}

const Root = () => {
	const context = useContext(AuthContext);
	const [isLoginIn, setIsLoginIn] = useState(true);
	useEffect(() => {
		const fetchToken = async () => {
			const storedToken = await AsyncStorage.getItem("token");

			if (storedToken) {
				context.authenticate(storedToken);
			}

			setIsLoginIn(false);
		};

		fetchToken();
	}, []);

	if (isLoginIn) {
		return <AppLoading />;
	}

	return <Navigation />;
};

export default function App() {
	return (
		<>
			<StatusBar style="light" />
			<AuthContextprovider>
				<Provider store={store}>
					<PersistGate
						loading={<Text>Loading...</Text>}
						persistor={persistor}
					>
						<Root />
					</PersistGate>
				</Provider>
			</AuthContextprovider>
		</>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		backgroundColor: Colors.primary[800]
	}
});
