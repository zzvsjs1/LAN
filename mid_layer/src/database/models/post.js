/**
 * Table Post:
 *
 * - PostID (PK): string
 * - Username (FK): string
 * - CreateDateTime: Date
 * - Text: string. We need to extend the length limit to 600.
 * - IsDelByAdmin: Boolean
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'post', {
      postID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createDateTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      isDelByAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      }
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );