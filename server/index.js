const express = require("express");
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require('./models/user.js');

const Otp = require('./models/otp.js')
const nodemailer = require('nodemailer');

require("dotenv").config();

const getAllPatients = require("./routes/api/getAllPatients");
const getPatientByID = require("./routes/api/getPatientByID");
const createPatient = require("./routes/api/createPatient");
const editPatientByID = require("./routes/api/editPatientByID");
const deletePatientByID = require("./routes/api/deletePatientByID");
const LoginRegisterRoute = require("./routes/LoginRegisterRoute.js");
const UserRoute = require("./routes/UserRoute.js");
const DashboardRoute = require("./routes/DashboardRoute.js");
const PatientRoute = require("./routes/StudentRoute.js");
const DoctorRoute = require("./routes/ExpertRoute.js");
const AppointmentRoute = require("./routes/AppointmentRoute.js");
const InvoiceRoute = require("./routes/InvoiceRoute.js");
const ProfileRoute = require("./routes/ProfileRoute.js");


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGOCONNECTION, { useNewUrlParser: true });


app.listen(process.env.PORT, () => {
    console.log("App listening on port " + process.env.PORT);
})

app.use(LoginRegisterRoute);
app.use(DashboardRoute);
app.use(UserRoute);
app.use(PatientRoute);
app.use(DoctorRoute);
app.use(AppointmentRoute);
app.use(InvoiceRoute);
app.use(ProfileRoute);



// // API that get all patients
// app.get('/patients', getAllPatients);

// //API that gets a patient by ID
// app.get('/patients/:id', getPatientByID);

// //API for adding a patient
// app.post('/patients', createPatient);

// //API for editting a details of the patient by ID 
// app.put('/patients/:id', editPatientByID);

// //API for deleting a  patient by ID
// app.delete('/patients/:id', deletePatientByID);



const emailUser = 'alihaiderawan1245@gmail.com';
const emailPass = 'tdptrezrgyijosbk';

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the user database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate an OTP
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expireIn = Date.now() + 5 * 60 * 1000;

        await Otp.create({
            email,
            code: otp,
            expireIn,
        });
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: emailUser,
                pass: emailPass,
            },
        });
        const mailOptions = {
            from: emailUser,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Enter Correct Email' });
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({ message: 'OTP sent successfully.' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process OTP request.' });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const otpRecord = await Otp.findOne({ email, code: otp });

        if (otpRecord) {
            if (otpRecord.expireIn >= Date.now()) {
                // OTP is valid
                // You can move the user to the password reset form here
                res.status(200).json({ message: 'OTP verification successful.' });
            } else {
                res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
            }
        } else {
            res.status(400).json({ error: 'Invalid OTP.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify OTP.' });
    }
});




app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
app.use('/api/paypal', require('./routes/api/paypal'));


app.get("/", (req, res) => {
    res.send("hello world");
});

