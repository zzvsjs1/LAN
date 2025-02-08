/**
 * Table replyReaction:
 *
 * - id (PK): integer
 * - Username (FK): string
 * - replyID (FK): string
 * - type: string
 *
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'replyReaction', {
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
      replyID: {
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