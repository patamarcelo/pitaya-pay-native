//--------------------------------- PEGAR OS USUÄRIOS ---------------------------------\\
const listAllUsers = (nextPageToken) => {
	// List batch of users, 1000 at a time.
	getAuth()
		.listUsers(1000, nextPageToken)
		.then((listUsersResult) => {
			listUsersResult.users.forEach((userRecord) => {
				console.log("user", userRecord.toJSON());
			});
			if (listUsersResult.pageToken) {
				// List next batch of users.
				listAllUsers(listUsersResult.pageToken);
			}
		})
		.catch((error) => {
			console.log("Error listing users:", error);
		});
};
// Start listing users from the beginning, 1000 at a time.
listAllUsers();
//--------------------------------- ######################## ---------------------------------\\

//--------------------------------- EXCLUIR USUÄRIOS ---------------------------------\\
const deleteUser = (uid) => {
	getAuth()
		.deleteUser(uid)
		.then(() => {
			console.log("Successfully deleted user");
		})
		.catch((error) => {
			console.log("Error deleting user:", error);
		});
};
//--------------------------------- ######################## ---------------------------------\\

//--------------------------------- CRIAR USUÁRIO ---------------------------------\\

const createUser = (userData) => {
	getAuth()
		.createUser({
			email: "user@example.com",
			emailVerified: false,
			phoneNumber: "+11234567890",
			password: "secretPassword",
			displayName: "John Doe",
			photoURL: "http://www.example.com/12345678/photo.png",
			disabled: false
		})
		.then((userRecord) => {
			// See the UserRecord reference doc for the contents of userRecord.
			console.log("Successfully created new user:", userRecord.uid);
		})
		.catch((error) => {
			console.log("Error creating new user:", error);
		});
};
//--------------------------------- ######################## ---------------------------------\\

//--------------------------------- Criando Custom Claims ---------------------------------\\
const createCustomClaims = () => {
	const userId = "some-uid";
	const additionalClaims = {
		premiumAccount: true
	};

	getAuth()
		.createCustomToken(userId, additionalClaims)
		.then((customToken) => {
			// Send token back to client
		})
		.catch((error) => {
			console.log("Error creating custom token:", error);
		});
};
//--------------------------------- ######################## ---------------------------------\\
