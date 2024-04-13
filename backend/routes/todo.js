import { config } from 'dotenv';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

import { z } from 'zod';

import { db } from '../db.js';

config();

export const todoRouter = Router();

todoRouter.get('/', async (req, res) => {
	const token = req.cookies.token;
	const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
	const data = await db.todo.findMany({
		where: {
			author: {
				username: userData.username,
			},
		},
	});
	res.send(data);
});

const createTodoSchema = z.object({
	title: z.string().min(1, {
		message: 'Title is required',
	}),
	content: z.string().min(1, {
		message: 'Content is required',
	}),
});

todoRouter.post('/create', async (req, res) => {
	const token = req.cookies.token;
	const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
	const { title, content } = createTodoSchema.parse(req.body);
	const data = await db.todo.create({
		data: {
			title,
			content,
			author: {
				connect: {
					username: userData.username,
				},
			},
		},
	});
	res.send(`Todo ${data.title} created by ${userData.username}`);
});

const updateTodoSchema = z.object({
	id: z.number().min(1, {
		message: 'Todo ID is required',
	}),
	title: z.string().min(1, {
		message: 'Title is required',
	}),
	content: z.string().min(1, {
		message: 'Content is required',
	}),
});

todoRouter.post('/update', async (req, res) => {
	const token = req.cookies.token;
	const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
	const { id, title, content } = updateTodoSchema.parse(req.body);
	const data = await db.todo.update({
		where: {
			id,
			author: {
				username: userData.username,
			},
		},
		data: {
			title,
			content,
		},
	});
	res.send(`Todo ${data.title} created by ${userData.username}`);
});

const deleteTodoSchema = z.object({
	id: z.number().min(1, {
		message: 'Todo ID is required',
	}),
});

todoRouter.post('/delete', async (req, res) => {
	const token = req.cookies.token;
	const userData = jwt.verify(token, process.env.JWT_SECRET_KEY);
	const { id } = deleteTodoSchema.parse(req.body);
	await db.todo.delete({
		where: {
			id,
			author: {
				username: userData.username,
			},
		},
	});
	res.send(`Todo ${id} deleted by ${userData.username}`);
});
