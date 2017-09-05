module.exports = function (socket) {

    socket.on('Test', function (data) {
        socket.emit('Test.Done', {
            message: "Done !"
        });
    });
};