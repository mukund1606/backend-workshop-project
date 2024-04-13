import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import { todoRouter } from './routes/todo.js';
import { userRouter, validateToken } from './routes/user.js';

const app = express();
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(cookieParser());

app.get('/', async (req, res) => {
	res.send('Hello World!');
});

app.listen(3000, () => {
	console.log('Server is running on http://localhost:3000');
});

app.use('/user', userRouter);

app.use('/todo', validateToken, todoRouter);
