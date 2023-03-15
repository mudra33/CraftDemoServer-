const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
	{
		userName: {
			type: String,
			maxlength: 40,
			index: true,
			trim: true,
			required: true,
			unique: true,
		},
		password: { type: String, required: true },
	},
	{ timestamps: true }
);

const userModel = mongoose.model('users', userSchema);

module.exports = userModel;
