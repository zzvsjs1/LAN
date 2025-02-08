/**
 * These codes idea are borrow from RMIT Further web programming
 * Ltl example week 9 and 10.
 *
 */
const { gql } = require("apollo-server-express");
const db = require('../database');
const argon2 = require('argon2');
const { QueryTypes } = require("sequelize");
const { PubSub } = require("graphql-subscriptions");

// Create pubsub.
const pubsub = new PubSub();

// Two trigger
const POST_REACTION_ISSUE_TRIGGER = 'POST_REACTION_ISSUE';
const REPLY_REACTION_ISSUE_TRIGGER = 'REPLY_REACTION_ISSUE';

// Fetch user, reaction and all replies.
const POST_FIND_OPTIONS = {
  include: [{
    model: db.postImg,
    as: 'postImgs'
  }, {
    model: db.user,
    as: 'user'
  }, {
    model: db.postReaction,
    as: 'postReactions'
  }, {
    model: db.reply,
    as: 'replies',
    include: [
      db.user,
      db.replyReaction
    ],
  }],
  // Change the order. Level 1 first.
  order: [
    [db.reply, 'level', 'ASC']
  ]
};

// We need to get the user.
const REPLY_FIND_OPTIONS = {
  include: [{
    model: db.user,
    as: 'user'
  }, {
    model: db.replyReaction,
    as: 'replyReactions',
  }],
};

/**
 * Change a Sequelize module to a json plant object.
 *
 * @param module
 * @return {any}
 */
function moduleToJsonObj(module) {
  return JSON.parse(JSON.stringify(module));
}

const typeDefs = gql`
  # The user module
  type User {
    username: String!
    email: String!,
    password: String!,
    avatar: String,
    joinDate: String!,
    isBlock: Boolean!
  }
  
  # Post img.
  type PostImg {
    postImgID: String!,
    postID: String!,
    url: String!,
    order: Int!,
  }
  
  # The post model.
  type Post {
    postID: String!,
    username: String!,
    createDateTime: String!,
    text: String!,
    postImgs: [PostImg!]!,
    isDelByAdmin: Boolean!,
    user: User!,
    postReactions: [PostReaction!]!,
    replies: [Reply!]!
  }
  
  # The reply model.
  type Reply {
    replyID: String!,
    username: String!,
    createDateTime: String!,
    text: String!,
    postID: String!,
    parentReplyID: String,
    level: Int!,
    isDelByAdmin: Boolean!,
    replyReactions: [ReplyReaction!]!,
    user: User!,
  }
  
  # Two reaction type.
  type PostReaction {
    id: Int!,
    username: String!,
    postID: String!,
    type: String!,
  }
  type ReplyReaction {
    id: Int!,
    username: String!,
    replyID: String!,
    type: String!,
  }
  
  # Update user used.
  input UserInput {
    username: String
    email: String,
    password: String,
    avatar: String,
    joinDate: String,
    isBlock: Boolean
  }
  
  # Used to update post.
  input PostInput {
    postID: String,
    username: String,
    createDateTime: String,
    text: String,
    postImgs: [PostImgInput!],
    isDelByAdmin: Boolean,
  }
  
  input PostImgInput {
    postImgID: String!,
    postID: String!,
    url: String!,
    order: Int!,
  }
  
  # For update reply.
  input ReplyInput {
    replyID: String,
    username: String,
    createDateTime: String,
    text: String,
    postID: String,
    parentReplyID: String,
    level: Int,
    isDelByAdmin: Boolean,
  }
  
  # For number of users using LAN per day.
  type UserPerDay {
    date: String!,
    count: Int!,
  }
  
  # For Profile visit.
  type ProfileVisitCount {
    username: String!,
    count: Int!,
  }
  
  # For followed.
  type FollowedAndCount {
    username: String!,
    count: Int!,
  }
  
  # All query functions.
  type Query {
    allUser: [User]
    allPosts: [Post]
    allPostReactions: [PostReaction]
    allReplyReactions: [ReplyReaction]
    userPerDay: [UserPerDay]
    topTenProfileVisit: [ProfileVisitCount]
    getTopTenFollowed: [FollowedAndCount]
  }
  
  # Mutations.
  type Mutation {
    updateUser(username: String, newUser: UserInput): User
    updatePost(postID: String, input: PostInput): Post
    updateReply(replyID: String, input: ReplyInput): Reply
  }
  
  # Subscription for post and reply
  type Subscription {
    postReactionIssue: Post
    replyReactionIssue: Reply
  }
  
`;

const resolvers = {
  Query: {
    // Fetch all users.
    allUser: async () => moduleToJsonObj(await db.user.findAll()),

    // Fetch all posts
    allPosts: async () => moduleToJsonObj(await db.post.findAll(POST_FIND_OPTIONS)),

    // Post and reply reactions.
    allPostReactions: async () => moduleToJsonObj(await db.postReaction.findAll()),
    allReplyReactions: async () => moduleToJsonObj(await db.replyReaction.findAll()),

    userPerDay: async () => {
      // Select and group by date.
      let ret = await db.sequelize.query(`
        SELECT date, COUNT (*) AS count
        FROM userLoginCount
        GROUP BY date
        ORDER BY date DESC
        LIMIT 10
    `, {
        type: QueryTypes.SELECT
      });

      // Change to js date first.
      ret = ret.map(value => {
        const newVal = { ...value };
        newVal.date = new Date(newVal.date);
        return newVal;
      });

      return moduleToJsonObj(ret);
    },

    topTenProfileVisit: async () => {
      // Select and group by username.
      const ret = await db.sequelize.query(`
          SELECT username, COUNT(*) as count
          FROM profileVisit
          GROUP BY username
          ORDER BY count ASC
          LIMIT 10
    `, {
        type: QueryTypes.SELECT
      });

      return moduleToJsonObj(ret);
    },

    getTopTenFollowed: async () => {
      // Select and group by following username.
      const ret = await db.sequelize.query(`
          SELECT followingUsername as username, COUNT(*) as count
          FROM followers
          GROUP BY followingUsername
          ORDER BY count
          LIMIT 10
    `, {
        type: QueryTypes.SELECT
      });

      return moduleToJsonObj(ret);
    },

  },

  Mutation: {
    // Update a user by field.
    // Ignore parent argument.
    updateUser: async (_, { username, newUser }) => {
      const oldUser = await db.user.findByPk(username);
      if (oldUser === null) {
        throw new Error(`No username "${username}".`);
      }

      // If input field contain password.
      if (newUser.password) {
        // If not equal.
        if (newUser.password !== oldUser.password) {
          if (!await argon2.verify(oldUser.password, newUser.password)) {
            newUser.password = await argon2.hash(newUser.password, { type: argon2.argon2id });
          } else {
            newUser.password = oldUser.password;
          }
        }
      }

      await oldUser.update(newUser);
      await oldUser.save();

      // Must return a json object.
      return moduleToJsonObj(oldUser);
    },

    // Use to update post.
    updatePost: async (_, { postID, input }) => {
      const oldPost = await db.post.findByPk(postID, POST_FIND_OPTIONS);
      if (oldPost === null) {
        throw new Error(`No post with postID "${postID}".`);
      }

      await oldPost.update(input);
      await oldPost.save();

      return moduleToJsonObj(oldPost);
    },

    // User to update post.
    updateReply: async (_, { replyID, input }) => {
      const oldReply = await db.reply.findByPk(replyID, REPLY_FIND_OPTIONS);
      if (oldReply === null) {
        throw new Error(`No reply with replyID "${replyID}".`);
      }

      await oldReply.update(input);
      await oldReply.save();

      return moduleToJsonObj(oldReply);
    },
  },

  // Two support subscriptions.
  Subscription: {
    postReactionIssue: {
      subscribe: () => pubsub.asyncIterator(POST_REACTION_ISSUE_TRIGGER)
    },
    replyReactionIssue: {
      subscribe: () => pubsub.asyncIterator(REPLY_REACTION_ISSUE_TRIGGER)
    },
  }
};

module.exports = {
  typeDefs,
  resolvers,
  pubsub,
  POST_REACTION_ISSUE_TRIGGER,
  REPLY_REACTION_ISSUE_TRIGGER,
  POST_FIND_OPTIONS,
  REPLY_FIND_OPTIONS,
  moduleToJsonObj
};
