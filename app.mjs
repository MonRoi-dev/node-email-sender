import express from 'express';
import 'dotenv/config'
import { fileURLToPath } from 'url';
import path from 'path';
import nodemailer from 'nodemailer';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
	host: process.env.HOST,
	port: 465,
	secure: true,
	auth: {
		user: process.env.USER,
		pass: process.env.PASS,
	},
});

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
	try {
		res.sendFile(path.join(__dirname, 'index.html'));
	} catch (err) {
		res.status(500).send('Error: Could not load the file');
	}
});

app.post('/', (req, res) => {
	const data = req.body;
	const message = {
		from: 'MonRoi27@yandex.ru',
		to: data.email,
		subject: 'Do not reply. This message sent automatically',
		text: 'Plaintext version of the message',
		html: data.text,
	};

	transporter.sendMail(message, (err) => {
		if (err) {
			console.log(err);
		}
	});

	res.redirect('/');
});

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server was started on port ${PORT}`));
