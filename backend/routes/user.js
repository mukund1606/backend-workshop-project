import { config } from 'dotenv';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { db } from '../db.js';

config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const userRouter = Router();

userRouter.post('/login', async (req, res) => {
	const { username, password } = req.body;
	const user = await db.user.findFirst({
		where: {
			username,
			password,
		},
	});
	if (user) {
		const data = {
			time: new Date().toISOString(),
			name: user.name,
			username: user.username,
		};
		const token = jwt.sign(data, JWT_SECRET_KEY);
		res.cookie('token', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'none',
		});
		res.json('Logged in successfully!');
	} else {
		res.status(401).send('Invalid credentials');
	}
});

userRouter.post('/register', async (req, res) => {
	const { name, username, password } = req.body;
	const isUserExists = await db.user.findFirst({
		where: {
			username,
		},
	});
	if (isUserExists) {
		return res.status(400).json('User already exists');
	}
	const user = await db.user.create({
		data: {
			name,
			username,
			password,
		},
	});
	res.json(`User ${user.name} created! Login to Continue.`);
});

userRouter.post('/logout', async (req, res) => {
	res.clearCookie('token');
	res.send('Logged out successfully!');
});

userRouter.get('/', validateToken, async (req, res) => {
	const user = await db.user.findFirst({
		where: {
			username: req.user.username,
		},
		select: {
			name: true,
			username: true,
		},
	});
	if (!user) {
		return res.status(401).send('User not found');
	}
	res.json(user);
});

export function validateToken(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).send('Access Denied');
	}
	try {
		const data = jwt.verify(token, JWT_SECRET_KEY);
		req.user = data;
		next();
	} catch (error) {
		res.status(400).send('Invalid Token');
	}
}
