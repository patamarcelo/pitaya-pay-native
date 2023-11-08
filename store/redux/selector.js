export const userSelector = (state) => state.usuario.user;
export const termsSelector = (state) => state.usuario.termsAccepted;

export const userCustomDataSelector = (state) => {
	const data = state.usuario.user;
	const customData = JSON.parse(data?.reloadUserInfo?.customAttributes);
	return customData;
};

export const createdUserSelector = (state) => state.usuario.createdUser;

export const confirmPaymentSelector = (state) => {
	const objToReturn = {
		createdUser: state.usuario.createdUser,
		creditCardInfo: state.usuario.creditCardInfo,
		clientIp: state.usuario.clientIp
	};
	return objToReturn;
};
