/**
 * Table followers:
 *
 * Id (PK): int (auto-increase)
 * FollowersUsername (FK): string
 * FollowingUsername (FK): string
 *
 */
module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'followers', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      followersUsername: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      followingUsername: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      freezeTableName: true,
      timestamps: false,
    },
  );