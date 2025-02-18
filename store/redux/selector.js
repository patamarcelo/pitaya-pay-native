export const userSelector = (state) => state.usuario.user;
export const termsSelector = (state) => state.usuario.termsAccepted;

export const selectUser = (state) => state.usuario.user;

export const userCustomDataSelector = (state) => {
	const data = state.usuario.user;
	const customData = JSON.parse(data?.reloadUserInfo?.customAttributes);
	return customData;
};

export const createdUserSelector = (state) => state.usuario.createdUser;

export const confirmPaymentSelectorUser = (state) => state.usuario.createdUser;
export const confirmPaymentSelectorCardInfo = (state) =>
	state.usuario.creditCardInfo;
export const confirmPaymentSelectorIp = (state) => state.usuario.clientIp;
