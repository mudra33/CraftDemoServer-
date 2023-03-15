const jwt = require('jsonwebtoken');

const createJWT = (userId, duration) => {
	const payload = {
		userId,
		duration,
	};
	return jwt.sign(payload, 'mudrasuthar', {
		expiresIn: duration,
	});
};

const checkUserAccess = (req, res, next) => {
	const accessToken = req.headers.authorization.split(' ')[1];

	const accessGranted = verifyToken(accessToken);
	console.log(accessToken, 'AccessToken');
	console.log(accessGranted, 'Acces');
	if (accessGranted) {
		next();
	} else {
		res.status(401).json({
			errors: ['Unauthorized User'],
		});
	}
};

const verifyToken = (accessToken) => {
	let accessGranted;
	jwt.verify(accessToken, 'mudrasuthar', (err, decoded) => {
		console.log(decoded, 'Decoded');
		console.log(err, 'err');
		if (err) {
			accessGranted = false;
		}
		if (decoded) {
			accessGranted = true;
		}
	});
	return accessGranted;
};

module.exports = {
	createJWT,
	checkUserAccess,
	verifyToken,
};
