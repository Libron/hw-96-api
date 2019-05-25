const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    dbUrl: 'mongodb://localhost/hw96',
    mongoOptions: {
        useNewUrlParser: true,
        useCreateIndex: true
    },
    facebook: {
        appId: '649512632188535',
        appSecret: '86b8e1ceed1cdf65de4704598af9ed90'
    }
};