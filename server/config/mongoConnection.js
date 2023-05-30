const MongoClient = require('mongodb').MongoClient;

const mongoConfig = {
    serverUrl:
        'mongodb+srv://tanay:xegSb0UONmKCP79a@cluster0.p7rwd.mongodb.net/house_of_books?retryWrites=true&w=majority',
    database: 'house_of_books',
};

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
    if (!_connection) {
        _connection = await MongoClient.connect(mongoConfig.serverUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        _db = await _connection.db(mongoConfig.database);
    }

    return _db;
};
