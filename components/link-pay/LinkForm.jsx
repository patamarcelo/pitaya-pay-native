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

import { addTransactionLinkPay } from "../../utils/firebase/firebase.datatable";
import { useSelector } from "react-redux";
import { userSelector } from "../../store/redux/selector";

import ProductsComp from "../ui/Payment/Products";
import { Divider } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { expo } from "../../app.json";



import {
    ALERT_TYPE,
    Dialog,
    AlertNotificationRoot,
    Toast
} from "react-native-alert-notification";

import { Colors } from "../../constants/styles";


import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;


const schema = yup.object({
    name: yup.string().required("De um nome para esta transação"),
    description: yup
        .string()
        .required("Informe uma descrição para esta transação"),
    // value: yup.number("Digite um número válido").required("Valor não pode ser zerado")
    value: yup
        .string()
        .default("") // ✅ Prevents initial validation error
        .nullable() // ✅ Allows empty values
        .notRequired() // ✅ Makes the field optional
        .matches(/^\d{1,}(,\d{0,2})?$/, "Valor inválido") // ✅ Only checks format if filled
        .transform((value, originalValue) =>
            originalValue ? originalValue.replace(/\./g, ",") : ""
        )
        .test("decimal-places", "Casas decimais inválidas", (value) => {
            if (!value) return true; // ✅ Allows empty value
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
    const [linkGenerated, setLinkGenerated] = useState(false);

    const [valuesFormObj, setvaluesFormObj] = useState({});
    const [errorHandler, setErrorHandler] = useState({
        name: "",
        description: "",
        // value: ""
    });

    const [altura] = useState(new Animated.Value(0)); // Start hidden
    const [largura] = useState(new Animated.Value(0)); // Start at 0 width
    const [opacity] = useState(new Animated.Value(0)); // Fade in effect

    useEffect(() => {
        if (linkToShare?.length > 0) {
            Animated.parallel([
                Animated.spring(largura, {
                    toValue: windowWidth - 40, // Slight padding
                    speed: 12,
                    bounciness: 8,
                    useNativeDriver: false,
                }),
                Animated.spring(altura, {
                    toValue: 140, // Smooth height expansion
                    speed: 12,
                    bounciness: 8,
                    useNativeDriver: false,
                }),
                Animated.timing(opacity, {
                    toValue: 1, // Fade in
                    duration: 300,
                    useNativeDriver: true,
                }),
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
        clearErrors,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onTouched", // ✅ Avoids validation on initial render
        shouldUnregister: false, // ✅ Prevents errors from showing on first render
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

    const [products, setProducts] = useState([]);
    const [productsComp, setProductsComp] = useState([]);
    const [parcelasSelected, setParcelasSelected] = useState([]);
    const [paymentValue, setPaymentValue] = useState(0);
    const [quantityProd, setQuantityProd] = useState(0);

    useEffect(() => {
        if (Number(paymentValue) > 0) {
            setValue("value", String(paymentValue), { shouldValidate: true, shouldDirty: true });
            console.log(getValues())

            setErrorHandler((prev) => {
                return { ...prev, value: String(paymentValue) }
            })
        } else {
            // setValue("value",'', { shouldValidate: true, shouldDirty: true });
            setValue("value",'');

            // setErrorHandler((prev) => {
            //     return {...prev, value: ''}
            // })
        }
    }, [paymentValue, setValue]);

    const handlerChangeParcelas = (e) => {
        console.log(e);
        setParcelasSelected(e);
    };

    const handleDeleteProduct = (e) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        setParcelasSelected(parcelasSelected.filter((data) => data !== e));
    };

    const handleResetForm = () => {
        console.log("resetando o formilário");
        setParcelasSelected([])
        setlinkToShare(null);
        setLinkGenerated(false)
        setErrorHandler({
            name: "",
            description: "",
            // value: ""
        });
        reset();
    };

    const handlerChangeObj = (key, data) => {
        setErrorHandler((prev) => {
            const updatedState = { ...prev, [key]: data };
            return updatedState;
        });

        clearErrors(key); // Clear validation error from react-hook-form
    };

    useEffect(() => {
        if (productsComp.length > 0 && parcelasSelected.length > 0) {
            console.log('prods error arr:', products.data)
            console.log('parcelas Selected::', parcelasSelected)
            const totalQuantity = products.data.filter((data) =>
                parcelasSelected.includes(data)
            );
            console.log('total quantityProd', totalQuantity)
            const total = products.data
                .filter((data) => parcelasSelected.includes(data))
                .reduce((acc, curr) => (acc += curr.sell_price), 0);
            console.log('total ', total)
            if (total > 0) {
                setPaymentValue(total);
                setQuantityProd(totalQuantity.length);
            } else {
                setPaymentValue(0);
                setQuantityProd(0);
            }
        } else {
            setPaymentValue(0);
            setQuantityProd(0);
        }

    }, [productsComp, parcelasSelected]);

    const handleLinkGenerator = async (formData) => {
        setIsLoading(true);
        console.log("Gerando o Link", formData);
        const newForm = {
            ...formData,
            prodctsSell: parcelasSelected
        }
        setvaluesFormObj(newForm);
        try {
            const newPaymentMethod = newForm
            const respPay = await createClient.post("createlinkpay", null, {
                params: {
                    newPaymentMethod: { ...newPaymentMethod, maxInstallmentCount: parseInt(3) },
                    user: JSON.stringify(user)
                }
            });
            const { data, status } = respPay;
            if (status === 200) {
                console.log("link gerado com sucesso: ", data);

                const newTrans = await addTransactionLinkPay(
                    user.displayName
                        ? user.displayName
                        : "Vendedor sem nome cadastrado",
                    user.email,
                    user.uid,
                    "Link de pagamento",
                    formData.value,
                    "1",
                    `Nome - ${formData.name}`,
                    [{ descricao: `descricao - ${formData.description}` }, ...parcelasSelected],
                    data.id,
                    `AppNative - ${disp} - version: ${expo?.version}`,
                    "-",
                    data.url
                );

                setlinkToShare(data.url);
                setLinkGenerated(true)
                setParcelasSelected([])
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

    const isDisabled = Object.values(errorHandler).some((value) => value === "") || parcelasSelected.length === 0;
    
    const isDisabledTeste = Object.values(errorHandler).some((value) => {
        console.log("Checking value:", value, "Result:", value === "");
        return value === "";
    });
    console.log('isDisabledTeste', isDisabledTeste)
    console.log('error handler: ', errorHandler)
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
                                                            borderColor: errors.getTitle && "#ff375b",
                                                            marginHorizontal: 10,
                                                        }}
                                                        label={getLabel}
                                                        onUpdateValue={(e) => {
                                                            console.log('changing here: ', e);
                                                            handlerChangeObj(data.title, e);
                                                            onChange(e);  // This will update the field correctly
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
                                                        value={value ?? ""}
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
                                {isLoading && (
                                    <View style={{ width: "90%", marginTop: 10 }}>
                                        <LoadingOverlay message={"Gerando Link...."} />
                                    </View>
                                )}
                                {!isLoading && linkToShare && linkToShare !== null && (
                                    <Animated.View
                                        style={[{ marginTop: 60 }, styles.shareConatiner, { width: largura, minHeight: altura }]}
                                    >
                                        <Text style={styles.textLink}>
                                            Link gerado no valor de R$ {valuesFormObj.value}
                                        </Text>
                                        <View style={{ width: "90%", marginTop: 30 }}>
                                            <Button onPress={onShare}>
                                                <Text>Compartilhar Link</Text>
                                            </Button>
                                        </View>
                                    </Animated.View>
                                )}
                                {/* <View style={{ height: 1, backgroundColor: 'gray', marginVertical: 8 }} /> */}
                                {
                                    linkGenerated === false &&
                                    <>
                                        <View style={{ width: '100%', marginBottom: 5 }}>
                                            <Divider style={{ height: 0.5, opacity: 0.5, backgroundColor: 'whitesmoke', marginVertical: 8 }} />
                                        </View>
                                        <ScrollView
                                            style={{ flex: 1 }}
                                            contentContainerStyle={{ width: "100%", alignItems: "stretch" }}
                                        // horizontal={false} // Ensures only vertical scrolling
                                        // showsVerticalScrollIndicator={false} // Optional: Hide scrollbar for a cleaner look
                                        >
                                            <ProductsComp
                                                products={products}
                                                setProducts={setProducts}
                                                productsComp={productsComp}
                                                setProductsComp={setProductsComp}
                                                parcelasSelected={parcelasSelected}
                                                setParcelasSelected={setParcelasSelected}
                                                handlerChangeParcelas={handlerChangeParcelas}
                                                handleDeleteProduct={handleDeleteProduct}
                                                paymentValue={paymentValue}
                                                quantityProd={quantityProd}
                                            />
                                        </ScrollView>
                                    </>
                                }
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </View>
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
                        disabled={isDisabled}
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
        width: "100%",
        position: 'absolute',
        bottom: 0,
        paddingTop: 20,
        paddingBottom: 50,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        backgroundColor: Colors.primary[500]
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
