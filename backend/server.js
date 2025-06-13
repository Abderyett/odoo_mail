const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(express.json()); // To parse JSON body from requests
app.use(cors()); // Allow cross-origin requests from your React app

// Nodemailer transporter setup with Gmail SMTP configuration
const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 465,
	secure: true, // Use TLS
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

// API route for handling form submission
app.post('/api/send-email', async (req, res) => {
	const { name, email, mobile, company, position, formation, source, location, medium, businessUnit } =
		req.body;

	const emailContent = `
    ::nom et prénom : '${name}'
    ::Email : '${email}'
    ::Mobile : '${mobile}'
    ::Business unit : 'Formations Diplômantes'
    ::Source : '${source}'
    ::Formation : '${formation}'
    ::Poste de travail : '${position}'
    ::Lieu de Formation : '${location}'
    ::Medium : '${medium}'
    ::Nom de l'entreprise : '${company}'
  `;

	try {
		await transporter.sendMail({
			from: process.env.EMAIL_USER, // Sender address
			to: 'formation@insag.edu.dz', // Recipient address
			subject: `Nouvelle inscription - ${name}`,
			text: emailContent,
			html: `<pre>${emailContent}</pre>`,
		});

		res.status(200).json({ success: true, message: 'Email sent successfully' });
	} catch (error) {
		console.error('Error sending email:', error);
		res.status(500).json({ success: false, message: 'Failed to send email' });
	}
});

// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
