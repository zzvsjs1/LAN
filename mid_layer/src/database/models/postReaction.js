/**
 * - id (PK): integer
 * - Username (FK): string
 * - postID (FK): string
 * - type: string
 *
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'postReaction', {
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
      postID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );