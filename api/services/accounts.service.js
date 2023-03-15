const httpStatus = require('http-status');
const Accounts = require('../models/accounts.model');
const ApiError = require('../utils/APIError');

const queryAccounts = async (filter, options) => {
	const accounts = await Accounts.paginate(filter, options);
	return accounts;
};

/**
 * Create a Accounts
 * @param {Object} AccountsBody
 * @returns {Promise<Accounts>}
 */
const createAccounts = async (req) => {
	const accounts = new Accounts(req.body);
	// console.log(accounts, 'accounts in services');
	const savedAccounts = await accounts.save();
	return savedAccounts;
};

/**
 * Get Accounts by id
 * @param {ObjectId} id
 * @returns {Promise<Accounts>}
 */
const getAccountById = async (id) => Accounts.findById(id);

const getAccountsByUserName = async (userName) =>
	Accounts.find({ userName: userName });
/**
 *
 * Update Accounts by id
 * @param {ObjectId} id
 * @param {Object} updateBody
 * @returns {Promise<Accounts>}
 */
const updateAccountsById = async (id, req) => {
	const accounts = await getAccountsById(id);
	if (!accounts) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Accounts not found');
	}
	accounts.name = req.name;
	accounts.description = req.description;
	accounts.image = req.image;
	await accounts.save();
	return accounts;
};

/**
 * Delete accounts by id
 * @param {ObjectId} id
 * @returns {Promise<Vehicle>}
 */
const deleteAccountsById = async (id) => {
	const accounts = await getAccountsById(id);
	if (!accounts) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Accounts not found');
	}
	await accounts.remove();
	return accounts;
};

module.exports = {
	queryAccounts,
	createAccounts,
	getAccountById,
	getAccountsByUserName,
	updateAccountsById,
	deleteAccountsById,
};
