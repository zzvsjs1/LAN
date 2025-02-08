/**
 * Create associations between some table.
 * The **association** is the foreign key.
 *
 * @param db A database object.
 */
function addAssociation(db) {
  // Each post has a foreign key, which is username.
  db.user.hasMany(db.post, { foreignKey: 'username' });
  db.post.belongsTo(db.user, { foreignKey: 'username' });

  // Each post has many post image, but one image can only belong to one post.
  db.post.hasMany(db.postImg, { foreignKey: 'postID' });
  db.postImg.belongsTo(db.post, { foreignKey: 'postID' });

  // Each post can have many replies.
  // Each user can also have many replies.
  // Each reply belong to one user and one post.
  db.post.hasMany(db.reply, { foreignKey: 'postID' });
  db.reply.belongsTo(db.post, { foreignKey: 'postID' });

  db.user.hasMany(db.reply, { foreignKey: 'username' });
  db.reply.belongsTo(db.user, { foreignKey: 'username' });

  db.reply.hasMany(db.reply, {
    foreignKey: 'parentReplyID',
    as: 'children',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });
  db.reply.belongsTo(db.reply, {
    foreignKey: 'parentReplyID',
    as: 'parent',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  });

  // Add fk for following.
  db.user.belongsToMany(db.user,
    { as: 'following', through: db.followers, foreignKey: 'followersUsername' });
  db.user.belongsToMany(db.user,
    { as: 'followedPeople', through: db.followers, foreignKey: 'followingUsername' });

  // Add one-to-many relationship between postReaction and Post
  db.post.hasMany(db.postReaction, { foreignKey: 'postID' });
  db.postReaction.belongsTo(db.post, { foreignKey: 'postID' });

  // Add one-to-many relationship between postReaction and User
  db.user.hasMany(db.postReaction, { foreignKey: 'username' });
  db.postReaction.belongsTo(db.user, { foreignKey: 'username' });

  // Add one-to-many relationship between replyReaction and Post
  db.reply.hasMany(db.replyReaction, { foreignKey: 'replyID' });
  db.replyReaction.belongsTo(db.reply, { foreignKey: 'replyID' });

  // Add one-to-many relationship between replyReaction and User
  db.user.hasMany(db.replyReaction, { foreignKey: 'username' });
  db.replyReaction.belongsTo(db.user, { foreignKey: 'username' });

  // User login count table.
  db.user.hasMany(db.userLoginCount, { foreignKey: 'username' });
  db.userLoginCount.belongsTo(db.user, { foreignKey: 'username' });

  // Profile visit and user.
  db.user.hasMany(db.profileVisit, { foreignKey: 'username' });
  db.profileVisit.belongsTo(db.user, { foreignKey: 'username' });
}

module.exports = (db, DataTypes) => {
  // User.
  db.user = require('./models/user')(db.sequelize, DataTypes);

  // Post
  db.post = require('./models/post')(db.sequelize, DataTypes);

  // PostImage
  db.postImg = require('./models/postImg')(db.sequelize, DataTypes);

  // Reply
  db.reply = require('./models/reply')(db.sequelize, DataTypes);

  // Following
  db.followers = require('./models/followers')(db.sequelize, DataTypes);

  // Post Reaction
  db.postReaction = require('./models/postReaction')(db.sequelize, DataTypes);

  // Reply Reaction
  db.replyReaction = require('./models/replyReaction')(db.sequelize, DataTypes);

  // Record user login history
  db.userLoginCount = require('./models/userLoginCount')(db.sequelize, DataTypes);

  // Profile visit.
  db.profileVisit = require('./models/profileVisit')(db.sequelize, DataTypes);

  addAssociation(db);
};
