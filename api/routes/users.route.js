const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { createJWT, verifyToken } = require('../services/auth.service');

router.post('/register', async (req, res) => {
	let { userName, password } = req.body;
	try {
		const existingUser = await User.findOne({ userName: userName });
		if (existingUser) {
			return res
				.status(422)
				.json({ errors: [{ user: 'username already exists' }] });
		} else {
			const newUser = new User({
				userName,
				password,
			});
			bcrypt
				.hash(password, 10)
				.then(async (hash) => {
					newUser.password = hash;
					const savedUser = await newUser.save();
					if (savedUser) {
						let access_token = createJWT(savedUser._id, 3600);
						const tokenVerified = verifyToken(access_token);
						if (tokenVerified) {
							res.status(201).json({
								success: true,
								token: access_token,
								user: {
									userName: savedUser.userName,
									updatedAt: savedUser.updatedAt,
								},
							});
						} else {
							res.status(401).json({
								errors: ['Unauthorized User'],
							});
						}
					} else {
						res.status(500).json({ errors: ['Error Creating New User'] });
					}
				})
				.catch((err) => {
					console.log('Catch', err.message);
					res.status(500).json({ error: [err.message] });
				});
		}
	} catch (err) {
		console.log(err.message);
		res.status(500).json({ error: [err.message] });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { userName, password } = req.body;
		const user = await User.findOne({ userName: userName });
		// if (user) {
		// 	const temp = {
		// 		userName: user.userName,
		// 		_id: user._id,
		// 	};
		// 	res.send(temp);
		// console.log(user, 'user upar');
		// console.log(password, 'password');
		// console.log(user['password'], "user['password']");
		// console.log(bcrypt.compare(password, user['password']));
		if (user) {
			bcrypt.compare(password, user.password, (result, err) => {
				if (!err) {
					console.log('Password does not match', err.message);
					res
						.status(401)
						.json({ errors: ['Password does not match; Unauthorized'] });
				} else {
					let access_token = createJWT(user._id, 3600);
					const tokenVerified = verifyToken(access_token);
					if (tokenVerified) {
						res.status(200).json({
							success: true,
							token: access_token,
							user: {
								userName: user.userName,
								updatedAt: user.updatedAt,
							},
						});
					} else {
						res.status(401).json({
							errors: ['Unauthorized User'],
						});
					}
				}
			});
		} else {
			res.status(404).json({ errors: ['Could not find entity'] });
		}
	} catch (err) {
		res.status(500).json({ errors: [err.message] });
	}
});

router.post('/getallusers', async (req, res) => {
	try {
		const users = await User.find();
		res.send(users);
	} catch (error) {
		return res.status(400).json({ message: error });
	}
});

module.exports = router;
