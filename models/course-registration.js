module.exports = (sequelize, DataTypes) => {
  const CourseRegistration = sequelize.define('CourseRegistration', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    studentId: { type: DataTypes.INTEGER },
    courseId: { type: DataTypes.INTEGER },
    registeredAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });

  CourseRegistration.associate = (models) => {
    CourseRegistration.belongsTo(models.Student, { foreignKey: 'studentId' });
    CourseRegistration.belongsTo(models.Course, { foreignKey: 'courseId' });
  };

  return CourseRegistration;
};
