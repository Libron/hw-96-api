const path = require('path');

const rootPath = __dirname;

const dbUrl = 'mongodb://localhost/hw96';

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, 'public/uploads'),
  dbUrl,
  mongoOptions: {
    useNewUrlParser: true,
    useCreateIndex: true
  }
};