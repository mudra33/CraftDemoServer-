const httpStatus = require('http-status');
const pick = require('../utils/pick');
const { omit } = require('lodash');
const Accounts = require('../models/accounts.model');
const { accountsService } = require('../services');
const { usersService } = require('../services');

/**
 * Load accounts and append to req.
 * @public
 *
 */
exports.load = async (req, res, next, userName) => {
	// console.log('load', userName);
	try {
		const accounts = await accountsService.getAccountsByUserName(userName);
		// console.log(accounts, 'accounts');
		req.locals = { accounts };
		// console.log(req.locals);
		return next();
	} catch (error) {
		return next(error);
	}
};
exports.signin = async (req, res, next) => {
	try {
		const { email, accountPassword } = req.body;

		console.log(email, 'email');
		console.log(accountPassword, 'accountPassword');
		const account = await Accounts.findOne({
			email: email,
			accountPassword: accountPassword,
		});

		account.updatedAt = Date.now();
		await account.save();
		// user.save();
		console.log(account, 'account');
		if (JSON.stringify(account) !== '{}') {
			const temp = {
				email: account.email,
				_id: account._id,
			};
			res.send(temp);
		} else {
			return res.status(400).json({ message: 'Login Failed' });
		}
	} catch (error) {
		return res.status(400).json({ message: error });
	}
};

exports.post = async (req, res, next, userName) => {
	// console.log('load', userName);
	try {
		const accounts = await accountsService.getAccountsByUserName(userName);
		// console.log(accounts, 'accounts');
		req.locals = { accounts };
		// console.log(req.locals);
		return next();
	} catch (error) {
		return next(error);
	}
};

/**
 * Get accounts
 * @public
 */
exports.get = async (req, res) => {
	// console.log(req.params, 'req.params');

	let user = await usersService.getUserByUserName(req.params.userName);
	// console.log(user, 'user');

	if (user && user.length == 0) {
		return res
			.status(404)
			.json({ errors: [{ user: 'UserName does not exist' }] });
	} else {
		try {
			const page = parseInt(req.query.page) - 1 || 0;
			const limit = parseInt(req.query.limit) || 5;
			const search = req.query.search || '';
			let sort = req.query.sort || 'updatedAt';
			let category = req.query.category || 'All';

			const categoryOptions = ['facebook', 'gmail'];

			category === 'All'
				? (category = [...categoryOptions])
				: (category = req.query.category.split(','));
			req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);

			let sortBy = {};
			if (sort[1]) {
				sortBy[sort[0]] = sort[1];
			} else {
				sortBy[sort[0]] = 'asc';
			}

			accounts = await Accounts.find({
				email: { $regex: search, $options: 'i' },
				userName: req.params.userName,
			})
				.where('category')
				.in([...category])
				.sort(sortBy)
				.skip(page * limit)
				.limit(limit);

			const total = await Accounts.countDocuments({
				category: { $in: [...category] },
				email: { $regex: search, $options: 'i' },
			});

			const response = {
				error: false,
				total,
				page: page + 1,
				limit,
				categories: categoryOptions,
				accounts,
			};

			res.status(200).json(response);
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: true, message: 'Internal Server Error' });
		}
	}
	// console.log(req, 'Req locals');
	// res.json(req.locals.accounts.transform());
};
/**
 * Create new accounts
 * @public
 */
exports.create = async (req, res, next) => {
	let user = await usersService.getUserByUserName(req.body.userName);
	console.log(user, 'user');

	if (user && user.length == 0) {
		return res
			.status(404)
			.json({ errors: [{ user: 'UserName does not exist' }] });
	} else {
		try {
			const accounts = await accountsService.createAccounts(req);
			res.status(httpStatus.CREATED).json(accounts.transform());
		} catch (err) {
			console.log(err);
			res.status(500).json({ error: true, message: 'Internal Server Error' });
		}
	}
};

/**
 * Replace existing accounts
 * @public
 */
exports.replace = async (req, res, next) => {
	const { accounts } = req.locals;
	const newAccounts = new Accounts(req.body);
	const newAccountsObject = omit(newAccounts.toObject(), '_id');

	await accounts.updateOne(newAccountsObject, {
		override: true,
		upsert: true,
	});
	const savedAccounts = await Accounts.findById(accounts._id);

	res.json(savedAccounts.transform());
};

/**
 * Update existing accounts
 * @public
 */

exports.update = async (req, res) => {
	const accounts = await accountsService.updateAccountsById(
		req.params.accountsId,
		req.body
	);
	res.send({
		message: 'Accounts Details Updated Successfully',
		data: accounts,
	});
};

/**
 * Get accounts list
 * @public
 */
exports.list = async (req, res, next) => {
	console.log(req.params, 'req params');
	try {
		// 	const filter = pick(req.query, ['name']);
		// 	const options = pick(req.query, ['sortBy', 'limit', 'page']);
		// 	console.log(filter, 'filter');
		// 	console.log(options, 'options');
		// 	const { data, pagination } = await accountsService.queryAccounts(
		// 		filter,
		// 		options
		// 	);
		// 	console.log(data, 'data');
		// 	console.log(pagination, 'Pagination');
		// 	res.send({ message: ' Deatils for Accounts', data, pagination });
		// } catch (error) {
		// 	next(error);
		// }
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || '';
		let sort = req.query.sort || 'updatedAt';
		let category = req.query.category || 'All';

		const categoryOptions = ['Facebook', 'Gmail'];

		category === 'All'
			? (category = [...categoryOptions])
			: (category = req.query.category.split(','));
		req.query.sort ? (sort = req.query.sort.split(',')) : (sort = [sort]);

		let sortBy = {};
		if (sort[1]) {
			sortBy[sort[0]] = sort[1];
		} else {
			sortBy[sort[0]] = 'asc';
		}

		const accounts = await Accounts.find({
			email: { $regex: search, $options: 'i' },
		})
			.where('category')
			.in([...category])
			.sort(sortBy)
			.skip(page * limit)
			.limit(limit);

		const total = await Accounts.countDocuments({
			category: { $in: [...category] },
			email: { $regex: search, $options: 'i' },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			categories: categoryOptions,
			accounts,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: 'Internal Server Error' });
	}
};

/**
 * Delete accounts
 * @public
 */
/**
 * Get Accounts by id
 * @param {ObjectId} id
 * @returns {Promise<Accounts>}
 */

exports.getAccountById = async (req, res, next) => {
	console.log('here');
	console.log(req.params, 'Req Params');
	try {
		const accounts = await accountsService.getAccountById(req.params.id);
		// console.log(accounts, 'accounts');
		res.status(200).json(accounts);
		// console.log(req.locals);
		return next();
	} catch (error) {
		return next(error);
	}
};

exports.remove = async (req, res, next) => {
	await accountsService.deleteAccountsById(req.params.accountsId);
	res
		.status(httpStatus.NO_CONTENT)
		.send({ message: 'Accounts deleted Successfully' });
};
