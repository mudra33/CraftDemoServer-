const Users = require('../models/user');

const getUserByUserName = async (userName) => {
	const user = await Users.find({ userName: userName });
	return user;
};

module.exports = {
	getUserByUserName,
};
