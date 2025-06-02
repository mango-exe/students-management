module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('Course', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    teacherId: { type: DataTypes.INTEGER },
  });

  Course.associate = (models) => {
    Course.belongsTo(models.Teacher, { foreignKey: 'teacherId' });
    Course.belongsToMany(models.Student, {
      through: models.CourseRegistration,
      foreignKey: 'courseId'
    });
    Course.hasMany(models.CourseRegistration, { foreignKey: 'courseId' });
  };

  return Course;
};
