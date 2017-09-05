var nconf = require('nconf');
var dateformat = require('dateformat');

module.exports = function (err, serviceName) {
    if (err.httpRes) {
        var res = err.httpRes;
        delete err.httpRes;
        res.status(err.status || 500);
        if (nconf.get('environment') === 'dev')
            res.json({
                error: (err.stack)
            });
        else
            res.json({error: "An error occurred ! T_T"});
    }

    if (nconf.get('environment') === 'dev') {
        console.error(err.stack);
    }
};