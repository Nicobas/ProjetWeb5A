var mongoose = require('mongoose');

module.exports.getById = function (model, id, fields, cb) {
    if (!id || !mongoose.Types.ObjectId.isValid(id))
        cb(null, null);
    else {
        model.findById(id, fields, cb);
    }
};

module.exports.save = function (obj, cb) {
    save(obj, cb);
};

module.exports.saveRecursive = function (array, cb) {
    saveRecursive(array, cb);
};

var saveRecursive = function (array, cb) {
    if (array.length === 0)
        cb();
    else {
        var obj = array[0];

        save(obj, function () {
            array.splice(0, 1);
            saveRecursive(array, cb);
        })
    }
};

var save = function (obj, cb) {
    obj.save(function (err) {
        cb(err);
    });
};