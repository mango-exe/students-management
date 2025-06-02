module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
  });

  Teacher.associate = (models) => {
    Teacher.hasMany(models.Course, { foreignKey: 'teacherId' });
  };

  return Teacher;
};
