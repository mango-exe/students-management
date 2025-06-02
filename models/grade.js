module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define('Grade', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    value: { type: DataTypes.STRING, allowNull: false },
    studentId: { type: DataTypes.INTEGER },
    courseId: { type: DataTypes.INTEGER },
  });

  Grade.associate = (models) => {
    Grade.belongsTo(models.Student, { foreignKey: 'studentId' });
    Grade.belongsTo(models.Course, { foreignKey: 'courseId' });
  };

  return Grade;
};
