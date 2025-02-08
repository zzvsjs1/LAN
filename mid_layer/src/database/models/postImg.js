/**
 * Table postImg - store the images for all post.
 *
 * - PostImageID (PK): string
 * - PostID (FK): string
 * - Url: string (Extend length to 1024)
 * - Order: Integer
 *
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'postImg', {
      postImgID: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      postID: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      order: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );