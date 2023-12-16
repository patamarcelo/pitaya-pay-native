import { useContext, useState } from "react";
import AuthContent from "../components/Auth/AuthContent";
import { loginUser } from "../utils/auth";
import { useNavigation } from "@react-navigation/native";
import LoadingOverlay from "../components/ui/LoadingOverlay";
import { Alert } from "react-native";
import { AuthContext } from "../store/auth-context";
import { authUser } from "../utils/firebase/firebase";
import { useDispatch } from "react-redux";
import { userActions } from "../store/redux/usuario";

function LoginScreen() {
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigation();
	const dispatch = useDispatch();
	const { setUser } = userActions;

	const context = useContext(AuthContext);

	const loginUserhandler = async ({ email, password }) => {
		setIsLoading(true);
		try {
			const user = await authUser(email, password);
			console.log("userLogin: ", user.user);
			context.authenticate(user.user.accessToken);
			dispatch(setUser(user.user));
		} catch (error) {
			console.log("erro ao logar usuário", error);
			Alert.alert("Authentication Failed!!", "Try again later!!");
		} finally {
			setIsLoading(false);
		}
	};

	if (isLoading) {
		return (
			<LoadingOverlay
				message={"Conectando você..."}
				color={"whitesmoke"}
			/>
		);
	}
	return <AuthContent isLogin onAuthenticate={loginUserhandler} />;
}

export default LoginScreen;
