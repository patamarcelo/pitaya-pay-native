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
    Pressable
} from "react-native";

import { useForm, Controler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Controller } from "react-hook-form";

import Input from "../Auth/Input";
import Button from "../ui/Button";
import { useHeaderHeight } from "@react-navigation/elements";
import { useState } from "react";

import { createClient } from "../../utils/axios/axios.utils";

import LoadingOverlay from '../ui/LoadingOverlay'
import { useNavigation } from "@react-navigation/native";


import {
    ALERT_TYPE,
    Dialog,
    AlertNotificationRoot,
    Toast
} from "react-native-alert-notification";

import { Colors } from "../../constants/styles";

const schema = yup.object({
    name: yup.string().required("De um nome para esta transação"),
    description: yup
        .string()
        .required("Informe uma descrição para esta transação"),
    value: yup.number("Digite um número válido").required("Valor não pode ser zerado")
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


    const [linkToShare, setlinkToShare] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const [valuesFormObj, setvaluesFormObj] = useState({});

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
            name: "",
            description: "",
            value: "",
            chargeType: "INSTALLMENT",
            // chargeType: "DETACHED",
            endDate: "2024-04-11",
            dueDateLimitDays: "10",
            billingType: "CREDIT_CARD",
            maxInstallmentCount: "3"
        }
    });

    const handleLinkGenerator = async (formData) => {
        setIsLoading(true)
        console.log("Gerando o Link", formData);
        setvaluesFormObj(formData)
        try {
            const newPaymentMethod = formData;
            const respPay = await createClient.post("createlinkpay", null, {
                params: {
                    newPaymentMethod
                }
            });
            const { data, status } = respPay;
            if (status === 200) {
                console.log("link gerado com sucesso: ", data);
                setlinkToShare(data.url);
            } else {
                console.log("erro ao gerar o Link");
            }
            setIsLoading(false)
        } catch (err) {
            console.log("erro ao gerar a transação", err);
            setIsLoading(false)
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
                    handleHome()
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

    const handleHome = ()=>{
        navigation.navigate("PagamentosTab");
    }
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
                                                        styleInput={{
                                                            borderWidth: errors.getTitle && 1,
                                                            borderColor: errors.getTitle && "#ff375b"
                                                        }}
                                                        label={getLabel}
                                                        onUpdateValue={onChange}
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
                    {
                        isLoading && 
                        <View style={{ width: "90%", marginTop: 200 }}>
                            <LoadingOverlay message={"Gerando Link...."}/>
                        </View>
                    }
                    {!isLoading && linkToShare && linkToShare !== null && (
                        <View style={[{ width: "100%", marginTop: 120 }, styles.shareConatiner]}>
                            <Text style={styles.textLink}>Link gerado no valor de R$ {valuesFormObj.value}</Text>
                            <View style={{width: '90%', marginTop: 30}}>
                            <Button onPress={onShare}>
                                <Text>Compartilhar Link</Text>
                            </Button>
                            </View>
                        </View>
                    )}
                    {/* </ScrollView> */}
                </SafeAreaView>
            </ScrollView>
            <View style={styles.btnView}>
                <Button
                    btnStyles={[styles.btnStyle, linkToShare && {backgroundColor: Colors.gold[600]} ]}
                    onPress={handleSubmit(handleLinkGenerator)}
                    disabled={linkToShare && true}
                >
                    {linkToShare ? "Link Gerado" : "Gerar Link"}
                </Button>
            </View>
        </>
    );
};

export default LinkForm;

const styles = StyleSheet.create({
    textLink:{
        fontSize: 18,
        color: Colors.secondary[200]
    },
    shareConatiner:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
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
	},
});
