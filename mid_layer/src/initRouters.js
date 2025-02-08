module.exports = (express, app) => {
  // User table.
  require('./routes/user.routes')(express, app);

  // Post table.
  require('./routes/post.routes')(express, app);

  // Post image table.
  require('./routes/postImg.router')(express, app);

  // Reply table.
  require('./routes/reply.routes')(express, app);

  // Follower table
  require('./routes/followers.routes')(express, app);

  // Post Reaction table
  require('./routes/postReaction.routes')(express, app);

  // Reply Reaction table
  require('./routes/replyReaction.routes')(express, app);

  // Profile visit.
  require('./routes/profileVisit.routes')(express, app);

  // User login count.
  require('./routes/userLoginCount.routes')(express, app);
};

