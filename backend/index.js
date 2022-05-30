const server = require('./server');

//Listening port
server.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));