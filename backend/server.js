const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Import routes
const userRoutes = require('./routes/userRoutes');
const loginRoutes = require('./routes/authenticationRoutes');
const resetPasswordRoutes = require('./routes/passwordRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const fontsRoutes = require('./routes/fontRoutes');
const roleRoutes = require('./routes/roleRoutes');
const employeeStatusRoutes = require('./routes/employeeStatusRoutes');
const statusRecordRoutes = require('./routes/statusRecordRoutes');

dotenv.config();

//Connect to database
connectDB();

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

//Route middlewares
app.use('/api/users', userRoutes);
app.use('/api/auth', loginRoutes);
app.use('/api/password', resetPasswordRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/fonts', fontsRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/employeeStatus', employeeStatusRoutes);
app.use('/api/statusRecord', statusRecordRoutes);

//Listening port
app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));