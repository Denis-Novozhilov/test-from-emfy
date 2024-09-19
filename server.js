const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/api/leads', async (req, res) => {
	const limit = req.query.limit;
	const page = req.query.page;

	const token =
		'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjNkNjFhYzcyYzBkMjZhZTM2NjdjYTkwYmEyZmViOTM3OTFhZmYzNmY3YWY4ZjIyOTIwNzE3ZjE5NGU1MTIwYWUyZDc0ODdjYzYyMjZjYjcyIn0.eyJhdWQiOiJhNGE5ZDE4Ny0zODc2LTQwYTktYTE0NC04MmI1OWQwZmM5NDEiLCJqdGkiOiIzZDYxYWM3MmMwZDI2YWUzNjY3Y2E5MGJhMmZlYjkzNzkxYWZmMzZmN2FmOGYyMjkyMDcxN2YxOTRlNTEyMGFlMmQ3NDg3Y2M2MjI2Y2I3MiIsImlhdCI6MTcyNjY0NTY0MiwibmJmIjoxNzI2NjQ1NjQyLCJleHAiOjE4ODQzODQwMDAsInN1YiI6IjExNTMyMTgyIiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxOTU2Mjg2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiZTQ3OGE1ZmUtZjVkYy00NTkwLWE4NTAtYjZmNzI0ZDgxMjQ1IiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.QjJTST7qVQ_WRKP0pY8QPn1c5aGVbbjxaHGZSjSqHI7eBrM0DUyOJt_aD4Fth53Sw_S6hnEsVIysnZ0NSUhFtr6HNtshwZ1dbtodG8hUqYME3ymy_UM8nL_Y8qE48P7rbxPTH3hN5YeinpRQOhXhg_GtPwM6wHiqBQtty45k2He0DdEAAbeqLv7PV9h6npjcuFPP1VvlyjF1kBN4O6RSWDPWCXi2lAapEgj6Dxs4_tzWuLJObe_k2gN2_mcjm46fHrRw2HAMsXSpkXwE5FRXhRBe7TkpCmyxkm5ImjnNsCZY1cTpdMa5W_ySMvmeE5tQd32xCDAIdvIE-clVwaoPUg';
	try {
		const response = await axios.get(
			`https://denisnovozhilovinfo.amocrm.ru/api/v4/leads?page=${page}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json',
					Accept: 'application/json'
				}
			}
		);
		res.status(200).json(response.data);
	} catch (error) {
		console.error('Ошибка запроса:', error);
		res.status(500).send('Ошибка сервера');
	}
});

app.listen(PORT, () => {
	console.log(`Сервер запущен на http://localhost:${PORT}`);
});
