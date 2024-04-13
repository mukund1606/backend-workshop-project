import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

async function logout() {
	await axios.post(
		'http://localhost:3000/user/logout',
		{},
		{
			withCredentials: true,
		}
	);
	Cookies.remove('isLoggedIn');
	window.location.href = '/login';
}

async function deleteTodo(todoId) {
	await axios.post(
		'http://localhost:3000/todo/delete',
		{
			id: todoId,
		},
		{
			withCredentials: true,
		}
	);
	window.location.reload();
}

export default function HomePage() {
	const [todos, setTodos] = useState([]);
	const [userData, setUserData] = useState({});

	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');

	const [editId, setEditId] = useState('');
	const [editTitle, setEditTitle] = useState('');
	const [editContent, setEditContent] = useState('');

	const [isEditOpen, setIsEditOpen] = useState(false);

	useEffect(() => {
		async function getTodos() {
			const data = axios.get('http://localhost:3000/todo', {
				withCredentials: true,
			});
			const userData = axios.get('http://localhost:3000/user', {
				withCredentials: true,
			});
			const res = await Promise.all([data, userData]);
			setTodos(res[0].data);
			setUserData(res[1].data);
		}
		getTodos();
	}, []);
	if (Cookies.get('isLoggedIn') !== 'true') {
		window.location.href = '/login';
		return;
	}

	return (
		<div className="p-4 flex flex-col gap-6">
			<div className="flex justify-end w-full gap-2 items-center">
				<h2 className="text-xl text-gray-500">Welcome {userData.name}! 🎉</h2>
				<button
					className="p-2 bg-red-500 text-white rounded-md"
					onClick={logout}
				>
					Logout
				</button>
			</div>
			{isEditOpen ? (
				<div className="flex flex-col gap-4 items-center justify-center p-4 border-2 rounded-md w-full md:w-1/2 mx-auto mt-4">
					<h1 className="text-4xl text-center font-bold">Edit Todo</h1>
					<input
						className="w-full p-4 border"
						placeholder="Title"
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
					/>
					<textarea
						className="w-full p-4 border"
						placeholder="Content"
						value={editContent}
						rows={4}
						onChange={(e) => setEditContent(e.target.value)}
					/>
					<button
						className="w-full p-4 bg-blue-500 text-white"
						onClick={async () => {
							if (editTitle.length === 0 || editContent.length === 0) {
								alert('Title and Content cannot be empty');
								return;
							}
							await axios.post(
								'http://localhost:3000/todo/update',
								{
									id: editId,
									title: editTitle,
									content: editContent,
								},
								{
									withCredentials: true,
								}
							);
							setEditTitle('');
							setEditContent('');
							setIsEditOpen(false);
							window.location.reload();
						}}
					>
						Edit Todo
					</button>
					<button
						className="w-full p-4 bg-red-500 text-white"
						onClick={() => setIsEditOpen(false)}
					>
						Cancel
					</button>
				</div>
			) : (
				<div className="flex flex-col gap-4 p-4 border-2 rounded-md w-full md:w-1/2 mx-auto mt-4">
					<h1 className="text-4xl text-center font-bold">Create Todo</h1>
					<input
						className="w-full p-4 border"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
					<textarea
						className="w-full p-4 border"
						placeholder="Content"
						value={content}
						rows={4}
						onChange={(e) => setContent(e.target.value)}
					/>
					<button
						className="w-full p-4 bg-blue-500 text-white"
						onClick={async () => {
							if (title.length === 0 || content.length === 0) {
								alert('Title and Content cannot be empty');
								return;
							}
							await axios.post(
								'http://localhost:3000/todo/create',
								{
									title,
									content,
								},
								{
									withCredentials: true,
								}
							);
							setTitle('');
							setContent('');
							window.location.reload();
						}}
					>
						Create Todo
					</button>
				</div>
			)}
			{todos.length > 0 ? (
				<div className="flex flex-col gap-4 p-4 border-2 rounded-md w-full mx-auto">
					<h1 className="text-4xl text-center font-bold">Todos</h1>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{todos.map((todo) => (
							<div key={todo.id} className="border p-4 m-4 w-full flex">
								<div className="w-full">
									<h1 className="text-2xl">{todo.title}</h1>
									<p>{todo.content}</p>
								</div>
								<div className="flex-1 space-y-1">
									<button
										className="p-2 bg-red-500 e-full text-white rounded-md"
										onClick={() => deleteTodo(todo.id)}
									>
										Delete
									</button>
									<button
										className="p-2 bg-blue-500 w-full text-white rounded-md"
										onClick={() => {
											setIsEditOpen(true);
											setEditId(todo.id);
											setEditTitle(todo.title);
											setEditContent(todo.content);
										}}
									>
										Edit
									</button>
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<h1 className="text-4xl text-center font-bold">No Todos Found</h1>
			)}
		</div>
	);
}
