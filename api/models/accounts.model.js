const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
const { toJSON, paginate } = require('./plugins');

/**
 * Accounts Schema
 * @private
 */
const accountsSchema = new mongoose.Schema(
	{
		userName: {
			type: String,
			maxlength: 40,
			index: true,
			trim: true,
			required: true,
		},
		email: { type: String, required: true },
		accountPassword: { type: String, required: true },
		category: { type: [String], required: true },
		description: { type: String, required: true },
	},
	{
		timestamps: true,
	}
);

/**
 * Methods
 */
accountsSchema.method({
	transform() {
		const transformed = {};
		const fields = [
			'id',
			'userName',
			'email',
			'category',
			'description',
			'createdAt',
			'updatedAt',
		];
		// console.log(fields, 'fields');

		fields.forEach((field) => {
			transformed[field] = this[field];
			// console.log(transformed[field], 'Transformed field');
		});

		return transformed;
	},
});

/**
 * Statics
 */
accountsSchema.statics = {
	/**
	 * Get accounts
	 *
	 * @param {ObjectId} id - The objectId of accounts.
	 * @returns {Promise<Accounts, APIError>}
	 */
	async get(id) {
		let accounts;

		if (mongoose.Types.ObjectId.isValid(id)) {
			accounts = await this.findById(id).exec();
		}
		if (accounts) {
			return accounts;
		}

		throw new APIError({
			message: 'Accounts does not exist',
			status: httpStatus.NOT_FOUND,
		});
	},

	/**
	 * List accountss in descending order of 'updatedAt' timestamp.
	 *
	 * @param {number} skip - Number of accountss to be skipped.
	 * @param {number} limit - Limit number of accountss to be returned.
	 * @returns {Promise<Accounts[]>}
	 */
	list({ page = 1, perPage = 30, userName }) {
		const options = omitBy({ userName }, isNil);

		return this.find(options)
			.sort({ updatedAt: -1 })
			.skip(perPage * (page - 1))
			.limit(perPage)
			.exec();
	},
};

accountsSchema.plugin(toJSON);
accountsSchema.plugin(paginate);

/**
 * @typedef Accounts
 */
module.exports = mongoose.model('Accounts', accountsSchema);
