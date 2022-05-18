const asyncHandler = require('express-async-handler')

const Stonk = require('../models/stonkModel')

module.exports = (io, socket) => {
    const getStonkData = async () => {
        const stonk = await Stonk.findOne().sort({createdAt: -1}).exec()
        if (stonk) {
            io.emit('stonks:data', stonk.toJSON());
        }
    }

    socket.on("stonks:get", getStonkData);
}