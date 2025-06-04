import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    //brevo smtp server
    host:'smtp-relay.brevo.com',
    //in bervo port
    port: 587,
    auth:{
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
})

export default transporter;