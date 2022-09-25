import express from 'express'
import { SMTPClient } from 'emailjs'
import 'dotenv/config'

const PORT = process.env.PORT || 5010
const HOST = process.env.HOST || ''
const USER_EMAIL = process.env.USER_EMAIL || ''
const PASSWORD = process.env.PASSWORD || ''
const EMAIL_FROM = process.env.EMAIL_FROM || ''
const EMAIL_TO = process.env.EMAIL_TO || ''

const client = new SMTPClient({
    host: HOST,
    ssl: true,
    user: USER_EMAIL,
    password: PASSWORD
})

const app = express()
app.use(express.json())

app.post('/contact', (req, res) => {
    const { email, subject, message } = req.body
    let emailMessage = `From: ${email}\n\nSubject: ${subject}\n\nMessage: ${message}`

    client.send(
        {
            from: EMAIL_FROM,
            to: EMAIL_TO,
            subject,
            text: emailMessage
        },
        (err, message) => {
            if (message) {
                return res.json({ success: 'Email Successfuly Sent' }).status(200)
            }
            if (err) {
                return res.json({ error: 'Email Not Sent' }).status(400)
            }
        }
    )
})

app.get('/health', (req, res) => {
    return res.json({ status: "OK" }).status(200);
})

app.listen(PORT, () => {
    console.log(`Server Running at PORT: ${PORT}`)
})
