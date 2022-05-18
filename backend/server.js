const express = require('express')
const path = require('path')
const colors = require('colors')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");
const port = process.env.PORT || 5000

connectDB()

const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/drinks', require('./routes/drinkRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/sales', require('./routes/saleRoutes'))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))
    console.log('ok')
    app.get('*', ((req, res) => res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'))))
}

const http = require('http').Server(app);
const io = require('socket.io')(http);
global.io = io

const stonkHandlers = require("./controllers/stonkController");
io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
        });
    } else {
        next(new Error('Authentication error'));
    }
})
io.on('connection', socket => {
    console.log('A user connected');

    //Whenever someone disconnects this piece of code executed
    socket.on('disconnect', function () {
        console.log('A user disconnected');
    });
    stonkHandlers(io, socket)
});
const Stonk = require('./models/stonkModel')
setInterval(async () => {
    const stonk = await Stonk.findOne().sort({createdAt: -1}).exec()
    if (stonk) {

        io.emit('stonks:data', stonk.toJSON());
    }
}, 5000);

app.use(errorHandler)
http.listen(port, () => console.log(`Server started on port ${port}`))