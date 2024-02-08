import { db } from "./firebase";
import { collection, addDoc, where } from "firebase/firestore";
import { query, orderBy, getDocs } from "firebase/firestore";
import { TABLES_FIREBASE } from "./firebase.typestables";

// import { query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
// import { collection, addDoc, Timestamp } from "firebase/firestore";

// TRANSACTIONS DB POST
export const addTransaction = async (
	sellerName,
	sellerMail,
	sellerId,
	type,
	value,
	quantityPayment,
	clientMail,
	prodctsSell,
	idAsaas,
	appVersion,
	compUrl
) => {
	const createdAt = new Date();
	let newTransaction;
	try {
		newTransaction = await addDoc(
			collection(db, TABLES_FIREBASE.transactions),
			{
				createdAt,
				sellerName,
				sellerMail,
				sellerId,
				type,
				value,
				quantityPayment,
				clientMail,
				prodctsSell,
				idAsaas,
				appVersion,
				compUrl
			}
		);
	} catch (error) {
		console.log("Error ao registrar a transação: ", error);
	}
	return newTransaction;
};

// ADD CUSTOMER CREDIT CARD FORM

export const addCustomer = async (name, mail, cpf, phone) => {
	const createdAt = new Date();
	let newCustomer;
	try {
		newCustomer = await addDoc(collection(db, TABLES_FIREBASE.customer), {
			createdAt,
			name,
			mail,
			cpf,
			phone
		});
	} catch (error) {
		console.log("Error ao registrar o usuário: ", error);
	}
	return newCustomer;
};

// ADD SIGN USER CONDITIOONS
export const addSign = async (name, mail, id, text) => {
	const createdAt = new Date();
	let newSign;
	try {
		newSign = await addDoc(collection(db, TABLES_FIREBASE.contract), {
			createdAt,
			agreement: "Aceito",
			name,
			mail,
			id,
			text
		});
	} catch (error) {
		console.log("Error ao assinar pelo usuário: ", error);
	}
	return newSign;
};

// TRANSACTIONS DB GET

export const getTransactionsQuery = async () => {
	const q = await query(
		collection(db, TABLES_FIREBASE.transactions),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	// console.log(querySnapshot.docs.map((docSnapshot) => docSnapshot.data()));
	return querySnapshot.docs.map((docSnapshot) => {
		return {
			...docSnapshot.data(),
			id: docSnapshot.id
		};
	});
};

export const getContractsSign = async () => {
	const q = await query(
		collection(db, TABLES_FIREBASE.contract),
		orderBy("createdAt", "desc")
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((docSnapshot) => {
		return {
			id: docSnapshot.data().id
		};
	});
};

export const getTransactionsById = async (sellerId, superUser, allContent) => {
	const today = new Date();
	const priorDate = new Date(new Date().setDate(today.getDate() - 90));
	console.log(priorDate);
	let q = "";
	console.log("superUSer", superUser);
	if (!allContent) {
		if (!superUser || superUser === null) {
			console.log("pegando os dados menor que 90");
			q = query(
				collection(db, TABLES_FIREBASE.transactions),
				where("sellerId", "==", sellerId),
				where("createdAt", ">", priorDate)
			);
		} else {
			console.log("pegando os dados menor que 90 else ");
			q = query(
				collection(db, TABLES_FIREBASE.transactions),
				where("createdAt", ">", priorDate)
			);
		}
	} else {
		console.log("pegando os dados MAIOR que 90");
		if (!superUser || superUser === null) {
			q = query(
				collection(db, TABLES_FIREBASE.transactions),
				where("sellerId", "==", sellerId)
			);
		} else {
			q = query(collection(db, TABLES_FIREBASE.transactions));
		}
	}
	const querySnapshot = await getDocs(q);
	let allData = [];
	querySnapshot.forEach((doc) => {
		const newData = {
			id: doc.id,
			...doc.data()
		};
		allData.push(newData);
	});
	console.table(allData);
	return allData;
};
