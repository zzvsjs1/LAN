/**
 * Table Reply
 * - ReplyID: string
 * - Username (FK): string
 * - CreateDateTime: string
 * - Text: string
 * - ParentPostID (FK): string
 * - ParentReplyID: string | null
 * - Level : Int
 * - IsDelByAdmin: Boolean
 *
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'reply', {
      replyID : {
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
      postID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      parentReplyID: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      level: {
        type: DataTypes.INTEGER,
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