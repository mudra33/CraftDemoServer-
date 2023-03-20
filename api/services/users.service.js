const Users = require('../models/user');

const getUserByUserName = async (userName) => {
	const user = await Users.find({ userName: userName });
	return user;
};

const updateUsersByUserName = async (userName, req) => {
	const users = await Users.findOne({ userName: userName });
	if (!users) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User Name not found');
	}
	console.log(req.favList, 'FavList');
	users.favList = req.favList;
	await users.save();
	return users;
};

const getUserDetails = async (userName) => {
	const user = await getUserByUserName(userName);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User Name not found');
	}
	return user;
};

module.exports = {
	getUserByUserName,
	updateUsersByUserName,
	getUserDetails,
};
