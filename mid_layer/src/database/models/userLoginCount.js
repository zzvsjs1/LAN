/**
 * Table userLoginCount:
 *
 * - Id (PK): integer
 * - Username (FK): string
 * - Date: date only
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'userLoginCount', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );