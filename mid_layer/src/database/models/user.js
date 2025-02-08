/**
 * Table User
 *
 * - Username (PK): string
 * - Email: string
 * - Password: string
 * - Avatar: string | null
 * - JoinDate: Date
 *
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'user', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
      },
      joinDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      isBlock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );