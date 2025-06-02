module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  Student.associate = (models) => {
    Student.belongsToMany(models.Course, {
      through: models.CourseRegistration,
      foreignKey: 'studentId'
    });
    Student.hasMany(models.Grade, { foreignKey: 'studentId' });
  };

  return Student;
};
