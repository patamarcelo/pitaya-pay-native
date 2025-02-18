import {
    View,
    StyleSheet,
    Text,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    Share,
    Pressable,
    Animated
} from "react-native";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Controller } from "react-hook-form";

import Input from "../Auth/Input";
import Button from "../ui/Button";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState, useEffect } from "react";

import { createClient } from "../../utils/axios/axios.utils";

import LoadingOverlay from "../ui/LoadingOverlay";
import { useNavigation } from "@react-navigation/native";

import { addTransaction } from "../../utils/firebase/firebase.datatable";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/redux/selector";


import {
    ALERT_TYPE,
    Dialog,
    AlertNotificationRoot,
    Toast
} from "react-native-alert-notification";

import { Colors } from "../../constants/styles";


import {Dimensions} from 'react-native';
const windowWidth = Dimensions.get('window').width;


const schema = yup.object({
    name: yup.string().required("De um nome para esta transação"),
    description: yup
        .string()
        .required("Informe uma descrição para esta transação"),
    // value: yup.number("Digite um número válido").required("Valor não pode ser zerado")
    value: yup
        .string()
        .matches(/^\d{1,}(,\d{0,2})?$/, "valor inválido")
        .transform((value, originalValue) =>
            originalValue ? originalValue.replace(/\./g, ",") : ""
        )
        .test("decimal-places", "Invalid decimal places", (value) => {
            if (!value) return true;
            const [, decimalPart] = value.split(",");
            return !decimalPart || decimalPart.length <= 2;
        })
});

const INPUTDATA = [
    {
        title: "name",
        label: "Nome",
        keyboardType: "default",
        placeholder: "Nome para a transação"
    },
    {
        title: "description",
        label: "Descrição",
        keyboardType: "default",
        placeholder: "Descrição da transação"
    },
    {
        title: "value",
        label: "Valor",
        keyboardType: "decimal-pad",
        placeholder: "R$ 0,00"
    }
];

const LinkForm = () => {
    const navigation = useNavigation();
    const user = useSelector(userSelector);
    const disp = Platform.OS;

    const [linkToShare, setlinkToShare] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [valuesFormObj, setvaluesFormObj] = useState({});
    const [errorHandler, setErrorHandler] = useState({
        name: "",
        description: "",
        value: ""
    });

    const [altura, setAltura] = useState(new Animated.Value(120));
	const [largura, setLargura] = useState(new Animated.Value(0));
    

    useEffect(() => {
		if (linkToShare && linkToShare.length > 0) {
			Animated.sequence([
				Animated.timing(largura, {
					toValue: windowWidth,
					duration: 180,
					useNativeDriver: false
				})
				// Animated.timing(altura, {
				// 	toValue: 150,
				// 	duration: 100
				// 	// useNativeDriver: true
				// })
			]).start();
		}
	}, [linkToShare]);

    const getFutureDate = () => {
        // Get current date
        let currentDate = new Date();

        // Add two days
        currentDate.setDate(currentDate.getDate() + 2);

        // Format the date to YYYY-MM-DD
        let year = currentDate.getFullYear();
        let month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Adding 1 because January is 0
        let day = String(currentDate.getDate()).padStart(2, "0");

        // Return the formatted date
        return `${year}-${month}-${day}`;
    };

    const height = useHeaderHeight();
    const {
        control,
        handleSubmit,
        getValues,
        setValue,
        reset,
        resetField,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            endDate: getFutureDate(),
            billingType: "CREDIT_CARD",
            chargeType: "INSTALLMENT",
            description: "",
            name: "",
            value: "",
            // chargeType: "DETACHED",
            maxInstallmentCount: parseInt(5.2),
            dueDateLimitDays: "10",
            notificationEnabled: false,
            }
    });

    const handleResetForm = () => {
        console.log("resetando o formilário");
        setlinkToShare(null);
        setErrorHandler({
            name: "",
            description: "",
            value: ""
        });
        reset();
    };

    const handlerChangeObj = (key, data) => {
        setErrorHandler((prev) => ({ ...prev, [key]: data }));
        console.log(errorHandler)
    };

    const handleLinkGenerator = async (formData) => {
        setIsLoading(true);
        console.log("Gerando o Link", formData);
        setvaluesFormObj(formData);
        try {
            const newPaymentMethod = formData;
            const respPay = await createClient.post("createlinkpay", null, {
                params: {
                    newPaymentMethod: {...newPaymentMethod, maxInstallmentCount: parseInt(3)},
                    user: JSON.stringify(user)
                }
            });
            const { data, status } = respPay;
            if (status === 200) {
                console.log("link gerado com sucesso: ", data);
                const newTrans = await addTransaction(
					user.displayName
						? user.displayName
						: "Vendedor sem nome cadastrado",
					user.email,
					user.uid,
					"Link de pagamento",
					formData.value,
					"1",
					`Nome - ${formData.name}`,
					`descricao - ${formData.description}`,
					data.id,
					`AppNative - ${disp}`,
					"-"
				);
                setlinkToShare(data.url);
                reset()
            } else {
                console.log("erro ao gerar o Link");
            }
            setIsLoading(false);
        } catch (err) {
            console.log("erro ao gerar a transação", err);
            setIsLoading(false);
            // Dialog.show({
            // 	type: ALERT_TYPE.DANGER,
            // 	title: <Title text={"Ops!!"} />,
            // 	textBody: <TrySomError />,
            // 	button: "Finalizar"
            // 	// onPressButton: () => {
            // 	// 	navigation.navigate("PagamentosTab");
            // 	// }
            // });
        }
    };

    const onShare = async () => {
        try {
            const result = await Share.share({
                message: `Olá. Segue o link de pagamento Pitaya Joias no valor de R$ ${valuesFormObj.value} ${linkToShare}`
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                    handleHome();
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    };

    const handleHome = () => {
        navigation.navigate("PagamentosTab");
    };
    return (
        <>
            <ScrollView style={styles.mainContainer} scrollEnabled={false}>
                <SafeAreaView style={styles.form}>
                    {/* <ScrollView style={{ width: "100%" }}> */}
                    <View style={styles.formView}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                            <KeyboardAvoidingView
                                keyboardVerticalOffset={height - 50}
                                style={styles.form}
                                // behavior={Platform.OS === "ios" ? "padding" : "height"}
                                behavior={Platform.OS == "ios" ? "padding" : "height"}
                                // keyboardVerticalOffset={Platform.OS == "ios" ? 0 : 20}
                                enabled={Platform.OS === "ios" ? true : false}
                            >
                                {INPUTDATA.map((data, i) => {
                                    const getTitle = data.title;
                                    const getLabel = data.label;
                                    return (
                                        <View key={i} style={{ width: "100%" }}>
                                            <Controller
                                                control={control}
                                                name={getTitle}
                                                render={({ field: { onChange, onBlur, value } }) => (
                                                    <Input
                                                    disabled={linkToShare && linkToShare.length > 0 ? true : false}
                                                        styleInput={{
                                                            borderWidth: errors.getTitle && 1,
                                                            borderColor: errors.getTitle && "#ff375b"
                                                        }}
                                                        label={getLabel}
                                                        onUpdateValue={(e) => {
                                                            handlerChangeObj(data.title, e);
                                                            onChange(e);
                                                        }}
                                                        // onUpdateValue={(e) => {
                                                        // 	handlerChange(e, getTitle);
                                                        // 	if (data.title !== "name") {
                                                        // 		onChange(e.trim());
                                                        // 	} else {
                                                        // 		onChange(e);
                                                        // 	}
                                                        // 	// onChange(
                                                        // 	// 	e
                                                        // 	// 	// .replace(/[^a-z0-9]/gi, "")
                                                        // 	// 	// .toUpperCase()
                                                        // 	// );
                                                        // }}
                                                        value={value}
                                                        keyboardType={data.keyboardType}
                                                        onBlur={onBlur}
                                                        inputStyles={styles.inputStyles}
                                                        placeholder={data.placeholder}
                                                        maxLength={data.maxLen}
                                                        inputContainerProps={{
                                                            width: "100%"
                                                        }}
                                                    />
                                                )}
                                            />
                                            {errors[getTitle] && (
                                                <Text style={styles.labelError}>
                                                    {errors[getTitle]?.message}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
                    {isLoading && (
                        <View style={{ width: "90%", marginTop: 200 }}>
                            <LoadingOverlay message={"Gerando Link...."} />
                        </View>
                    )}
                    {!isLoading && linkToShare && linkToShare !== null && (
                        <Animated.View
                            style={[{marginTop: 120 }, styles.shareConatiner, { width: largura, minHeight: altura }]}
                        >
                            <Text style={styles.textLink}>
                                Link gerado no valor de R$ {valuesFormObj.value}
                            </Text>
                            <View style={{ width: "90%", marginTop: 30}}>
                                <Button onPress={onShare}>                               
                                <Text>Compartilhar Link</Text>
                                </Button>
                            </View>
                        </Animated.View>
                    )}
                    {/* </ScrollView> */}
                </SafeAreaView>
            </ScrollView>
            <View style={styles.btnView}>
                {linkToShare && linkToShare.length > 0 ? (
                    <Button
                        btnStyles={[
                            styles.btnStyle,
                            linkToShare && { backgroundColor: Colors.gold[600] }
                        ]}
                        onPress={handleResetForm}
                    >
                        Gerar outro Link
                    </Button>
                ) : (
                    <Button
                        btnStyles={[
                            styles.btnStyle,
                            linkToShare && { backgroundColor: Colors.gold[600] }
                        ]}
                        onPress={handleSubmit(handleLinkGenerator)}
                        disabled={
                            errorHandler.description === "" ||
                            errorHandler.name === "" ||
                            errorHandler.value === "" ? true : false
                        }
                    >
                        Gerar Link
                    </Button>
                )}
            </View>
        </>
    );
};

export default LinkForm;

const styles = StyleSheet.create({
    textLink: {
        fontSize: 18,
        color: Colors.secondary[200]
    },
    shareConatiner: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center"
    },
    formView: {
        flex: 1,
        width: "100%"
    },
    btnView: {
        // flex: 1,
        width: "90%",
        marginBottom: 100
    },
    form: {
        flex: 1,
        width: "100%",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: 10
    },
    mainContainer: {
        flex: 1,
        width: "100%"
    },
    labelError: {
        alignSelf: "flex-start",
        color: Colors.gold[500],
        marginBottom: 2
    }
});
