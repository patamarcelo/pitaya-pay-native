import { View, Text, StyleSheet, ScrollView } from "react-native";
import { TERMS } from "../../utils/term";
import { Colors } from "../../constants/styles";
import Button from "../ui/Button";
import { useSelector, useDispatch } from "react-redux";
import { termsSelector, userSelector } from "../../store/redux/selector";
import { userActions } from "../../store/redux/usuario";
import { useNavigation } from "@react-navigation/native";
import { CheckBox, Stack } from "@rneui/themed";
import { useState } from "react";
import { addSign } from "../../utils/firebase/firebase.datatable";
import LoadingOverlay from "../ui/LoadingOverlay";

const ServiceTerms = () => {
	const termsAccepted = useSelector(termsSelector);
	const user = useSelector(userSelector);
	const dispatch = useDispatch();
	const navigation = useNavigation();
	const { registerTerms } = userActions;
	const [checked, setChecked] = useState(false);
	const [loading, setLoading] = useState(false);

	const hanleConfirmTerms = async () => {
		setLoading(true);
		try {
			const newSign = await addSign(
				user.displayName,
				user.email,
				user.uid,
				TERMS
			);

			console.log("newSign", newSign);
			dispatch(registerTerms());
		} catch (err) {
			console.log("erro ao registrar a assinatura", err);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<LoadingOverlay
				message={"Registrando..."}
				cntStyles={{ backgroundColor: Colors.secondary[100] }}
				style={{ color: "black" }}
			/>
		);
	}

	return (
		<ScrollView>
			<View style={styles.mainContainer}>
				<Text style={styles.title}>
					TERMO DE COMPROMISSO E RESPONSABILIDADE
				</Text>
				<View style={{ marginTop: 5 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Primeira.</Text>{" "}
						Em razão da{" "}
						<Text style={styles.underlineText}>
							utilização das ferramentas tecnológicas
						</Text>{" "}
						<Text>
							disponibilizadas pela{" "}
							<Text style={styles.boldText}>Consignante</Text>,
							por meio deste sítio eletrônico, a{" "}
							<Text style={styles.boldText}>Consignatária</Text>{" "}
							fará a coleta e uso (tratamento) de{" "}
							<Text style={styles.boldText}>Dados Pessoais</Text>{" "}
							de terceiros,{" "}
							<Text style={styles.boldText}>Clientes</Text>, pelos
							quais se responsabiliza integralmente, na forma da
							legislação pátria vigente, em especial, mas não
							somente, LGPD - Lei Geral Proteção de Dados Pessoais
							(Lei nº 13.709/2018), Código Civil (Lei Nº 10.406,
							de 10 de janeiro de 2002), Código Penal (Decreto-Lei
							nº 2.848, de 7 de dezembro de 1940), assim como
							pelas disposições deste Temo.
						</Text>
					</Text>
				</View>
				<View style={{ marginTop: 10 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Segunda.</Text>{" "}
						O tratamento dos dados aqui referidos se dará com o
						escopo único e exclusivo de adimplemento, pelos{" "}
						<Text style={styles.boldText}>Clientes</Text>, à{" "}
						<Text style={styles.boldText}>Pitaya</Text>, dos valores
						atinentes aos{" "}
						<Text style={styles.boldText}>Produtos</Text>{" "}
						adquiridos, ou seja, para cadastro e pagamento, do{" "}
						<Text style={styles.boldText}>Cliente</Text> na
						plataforma da{" "}
						<Text style={styles.boldText}>Pitaya</Text>;
					</Text>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Terceira.</Text>{" "}
						As credenciais de acesso (login e senha) fornecidas à{" "}
						<Text style={styles.boldText}>Consignatária</Text> são
						de uso pessoal desta, intrasferível, e de conhecimento
						exclusivo, sendo de{" "}
						<Text style={styles.boldText}>
							sua inteira responsabilidade
						</Text>{" "}
						todo e qualquer prejuízo causado pelo fornecimento da
						senha pessoal à terceiros, independente do motivo, ou
						mesmo sua utilização por terceiros, ainda que não
						fornecidas propositalmente a estes;
					</Text>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Quarta.</Text>{" "}
						Para os fins de utilização das ferramentas tecnológicas
						fornecidas, serão consideradas confidenciais todas as
						informações transmitidas por meios escritos,
						eletrônicos, verbais ou quaisquer outros e de qualquer
						natureza;
					</Text>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Quinta.</Text> É
						proibida a cópia de qualquer informação de{" "}
						<Text style={styles.boldText}>Clientes</Text> para
						dispositivos estranhos à estrutura do Sistema
						disponibilizado pela{" "}
						<Text style={styles.boldText}>Pitaya</Text>, bem como a
						divulgação, compartilhamento e uso, exceto se a referida
						ação seja estritamente necessária para a prestação dos
						serviços contratados, devendo ser realizada com a maior
						segurança possível e com expressa e prévia autorização
						do representante legal da{" "}
						<Text style={styles.boldText}>Pitaya</Text>;
					</Text>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Sexta.</Text> Os
						prejuízos, de qualquer natureza, causados pela{" "}
						<Text style={styles.boldText}>Consignatária</Text> à{" "}
						<Text style={styles.boldText}>Pitaya</Text>, ao sistema
						ou aos <Text style={styles.boldText}>Clientes</Text>, em
						razão da quebra de confidencialidade, integridade, ou
						utilização indevida das informações e dados acessados,
						são de{" "}
						<Text style={styles.underlineText}>
							inteira responsabilidade da Consignatária
						</Text>
						, que se compromete com o imediato reembolso/pagamento
						dos prejuízos causados, que poderão, ainda, ser
						reclamados judicialmente, caso em que arcará, ainda, com
						custas e honorários advocatícios.
					</Text>
				</View>

				<View style={{ marginTop: 10 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Sétima.</Text>{" "}
						Para fins deste instrumento, os termos “Operador”,
						“Controlador”, “Dados Pessoais”, “Dados Pessoais
						Sensíveis”, “Tratamento”, “Titular”, dentre as outras
						elencadas no artigo 5 da Lei Geral de Proteção de Dados
						(“LGPD”), terão o mesmo significado definido na Lei.
					</Text>
				</View>

				<View style={{ marginTop: 10, paddingBottom: 20 }}>
					<Text style={styles.text}>
						<Text style={styles.boldText}> Cláusula Oitava. </Text>A{" "}
						<Text style={styles.boldText}>Consignatária</Text> se
						compromete a: (i) coletar, processar, compartilhar ou
						realizar quaisquer atividades de tratamento aos dados
						pessoais relacionados ao presente Contrato em acordo com
						as leis, regulamentos e melhores práticas acerca da
						segurança, da confidencialidade e da proteção dos Dados
						Pessoais, em especial as disposições da LGPD - Lei Geral
						de Proteção de Dados Pessoais (Lei nº 13.709/2018) para
						a proteção desses dados pessoais e a preservação da
						privacidade dos respectivos titulares, (ii) restringir o
						tratamento de dados pessoais sob seu controle às
						situações em que haja finalidade lícita e embasamento
						legal adequado, e enquanto essas finalidades
						justificarem o seu tratamento; (iii) cumprir políticas e
						normas internas aplicáveis quanto ao tratamento de dados
						pessoais bem como as leis e regulamentos sobre a
						matéria; (iv) manter encarregado pelo tratamento de
						dados pessoais e canais de comunicação exclusivos para
						contato dos titulares de dados pessoais e autoridades
						com relação ao exercício de direitos e exigência de
						deveres relacionados à privacidade e proteção de dados;
						e (v) manter-se adequadas à LGPD conforme as melhores
						práticas de privacidade, segurança, confidencialidade e
						proteção dos Dados Pessoais aplicáveis ao setor.
					</Text>
				</View>
				{!termsAccepted && (
					<View style={styles.confirmContainer}>
						<CheckBox
							containerStyle={styles.containerCheck}
							wrapperStyle={styles.wraperCheck}
							checked={checked}
							title="Aceito os Termos"
							onPress={() => setChecked(!checked)}
						/>

						<Button disabled={!checked} onPress={hanleConfirmTerms}>
							{" "}
							Aceitar
						</Button>
					</View>
				)}
			</View>
		</ScrollView>
	);
};

export default ServiceTerms;

const styles = StyleSheet.create({
	wraperCheck: {
		textAlign: "center",
		justifyContent: "center"
		// marginLeft: 0
	},
	containerCheck: {
		backgroundColor: Colors.secondary[100],
		borderRadius: 9,
		width: "100%",
		textAlign: "center",
		justifyContent: "center"
	},
	confirmContainer: {
		width: "90%",
		marginBottom: 60
	},
	boldText: {
		fontWeight: "bold"
	},
	underlineText: {
		textDecorationLine: "underline"
	},
	title: {
		fontWeight: "bold",
		marginVertical: 10
	},
	text: {
		textAlign: "justify"
	},
	mainContainer: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: 15,
		paddingVertical: 5,
		backgroundColor: Colors.secondary[100]
	}
});
