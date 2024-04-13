import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	if (Cookies.get('isLoggedIn') === 'true') {
		window.location.href = '/';
		return;
	}

	async function login() {
		try {
			const res = await axios.post(
				'http://localhost:3000/user/login',
				{
					username,
					password,
				},
				{
					withCredentials: true,
				}
			);
			if (res.status === 200) {
				Cookies.set('isLoggedIn', 'true');
				window.location.href = '/';
			} else {
				console.error('Failed to log in');
				alert('Failed to log in');
			}
		} catch (error) {
			alert(error.response.data);
		}
	}

	return (
		<div className="w-full h-screen flex justify-center p-4 md:p-6 lg:p-8 xl:p-12">
			<div className="my-auto w-full flex flex-col gap-4 justify-center border-2 p-4 rounded-md">
				<h1 className="text-4xl text-center font-bold">Login</h1>
				<input
					className="w-full p-4 border"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<div className="flex gap-2">
					<input
						className="w-full p-4 border"
						placeholder="Password"
						type={isPasswordVisible ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<button
						className="w-full p-4 bg-blue-500 text-white  flex-1"
						onClick={() => setIsPasswordVisible((prev) => !prev)}
					>
						{isPasswordVisible ? 'Hide' : 'Show'} password
					</button>
				</div>
				<a href="/register" className="text-blue-500 text-center">
					{"Don't have an account? Register"}
				</a>
				<button className="w-full p-4 bg-blue-500 text-white" onClick={login}>
					Login
				</button>
			</div>
		</div>
	);
}
