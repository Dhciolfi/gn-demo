Parse.Cloud.define('signup', async (req) => {
	if(req.params.fullname == null) throw 'INVALID_FULLNAME';
	if(req.params.phone == null) throw 'INVALID_PHONE';
	if(req.params.cpf == null) throw 'INVALID_CPF';

	const user = new Parse.User();

	user.set('username', req.params.email);
	user.set('email', req.params.email);
	user.set('password', req.params.password);
	user.set('fullname', req.params.fullname);
	user.set('phone', req.params.phone);
	user.set('cpf', req.params.cpf);

	try {
		const resultUser = await user.signUp(null, {useMasterKey: true});
		const userJson = resultUser.toJSON();
		return formatUser(userJson);
	} catch (e) {
		throw 'INVALID_DATA';
	}
});

Parse.Cloud.define('login', async (req) => {
	try {
		const user = await Parse.User.logIn(req.params.email, req.params.password);
		const userJson = user.toJSON();
		return formatUser(userJson);
	} catch (e) {
		throw 'INVALID_CREDENTIALS';
	}
});

Parse.Cloud.define('validate-token', async (req) => {
	try {
	    return formatUser(req.user.toJSON());
	} catch (e) {
		throw 'INVALID_TOKEN';
	}
});

Parse.Cloud.define('change-password', async (req) => {
	if(req.user == null) throw 'INVALID_USER';

	const user = await Parse.User.logIn(req.params.email, req.params.currentPassword);
	if(user.id != req.user.id) throw 'INVALID_USER';
	user.set('password', req.params.newPassword);
	await user.save(null, {useMasterKey: true});
});

Parse.Cloud.define('reset-password', async (req) => {
	await Parse.User.requestPasswordReset(req.params.email);
});

function formatUser(userJson) {
	return {
		id: userJson.objectId,
		fullname: userJson.fullname,
		email: userJson.email,
		phone: userJson.phone,
		cpf: userJson.cpf,
		token: userJson.sessionToken,
	}
}