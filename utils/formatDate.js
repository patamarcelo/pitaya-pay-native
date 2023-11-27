import moment from "moment";

export const formatDateFirebase = (entry) => {
	const entrada = entry;
	let date = "";
	let atTime = "";
	if (typeof entrada === "object") {
		newDate = moment(
			new Date(entrada.seconds * 1000 + entrada.nanoseconds / 1000000)
		).format("DD/MM/YY - HH:mm");
		// const newDate = new Date(
		// entrada.seconds * 1000 + entrada.nanoseconds / 1000000
		// );
		date = newDate.split("-")[0];
		atTime = newDate.split("-")[1];
	} else {
		date = moment(entry).format("YYYY-MM-DD");
		// atTime = entrada.split("T")[1].split(".")[0];
		// console.log("intraDate: ", date);
		// atTime = date.toLocaleTimeString();
	}

	// const [year, month, day] = date.split("-");
	// const formatDate = [day, month, year].join("/");
	// const dateF = `${date} - ${atTime}`;
	const dateF = `${date}`;
	// const dateF = `${date} - `
	// const dateF = "-";
	return dateF;
};
