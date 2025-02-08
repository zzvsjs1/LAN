/**
 * Table profile visit
 *
 * id [PK]: int
 * username: string
 * datetime: date
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'profileVisit', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false
      },
      datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );