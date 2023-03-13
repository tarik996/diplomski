const express = require('express');
const path = require('path');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

dotenv.config();

//Connect to database
connectDB();

//Import routes
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/authenticationRoutes');
const resetPasswordRoutes = require('./routes/passwordRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const fontsRoutes = require('./routes/fontRoutes');
const roleRoutes = require('./routes/roleRoutes');
const employeeStatusRoutes = require('./routes/employeeStatusRoutes');
const statusRecordRoutes = require('./routes/statusRecordRoutes');
const sallaryRoutes = require('./routes/sallaryRoutes');

//Middleware
app.use(express.json());
app.use(cookieParser());

if(process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "../frontend/build")));
}
else if(process.env.NODE_ENV === 'development')  {
    app.use(cors({
        origin: ["http://localhost:3000"],
        credentials: true,
        optionSuccessStatus: 200
    }));
}

//Route middlewares
app.use('/api/users', userRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/password', resetPasswordRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/fonts', fontsRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/employeeStatus', employeeStatusRoutes);
app.use('/api/statusRecord', statusRecordRoutes);
app.use('/api/sallary', sallaryRoutes);

var server = app;

module.exports = server;