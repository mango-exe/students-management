const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('university_management', 'root', 'rootpass', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306,
  logging: false, // optional: disable logging
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.sequelize.authenticate()
  .then(() => console.log('MySQL DB connected successfully.'))
  .catch(err => console.error('Unable to connect to MySQL:', err));

db.Student = require('./student')(sequelize, DataTypes);
db.Teacher = require('./teacher')(sequelize, DataTypes);
db.Course = require('./course')(sequelize, DataTypes);
db.CourseRegistration = require('./course-registration')(sequelize, DataTypes);
db.Grade = require('./grade')(sequelize, DataTypes);

Object.keys(db).forEach((modelName) => {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

// Sync the database with force: true (drops & recreates tables)
// db.sequelize.sync({ force: true })
//   .then(() => {
//     console.log('Database synchronized (all tables dropped and recreated)');
//   })
//   .catch((err) => {
//     console.error('Error syncing database:', err);
//   });

module.exports = db;
