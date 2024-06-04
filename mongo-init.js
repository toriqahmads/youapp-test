// use db admin
db = db.getSiblingDB('admin');
// auth db admin using specific user from env
db.auth(process.env.MONGO_INITDB_ROOT_USERNAME, process.env.MONGO_INITDB_ROOT_PASSWORD);

// create and use db from env
db = db.getSiblingDB(process.env.MONGO_INITDB_DATABASE);
// create user to db
db.createUser({
    'user': process.env.MONGO_INITDB_ROOT_USERNAME,
    'pwd': process.env.MONGO_INITDB_ROOT_PASSWORD,
    'roles': [{
        'role': 'dbOwner',
        'db': process.env.MONGO_INITDB_DATABASE
    }]
});