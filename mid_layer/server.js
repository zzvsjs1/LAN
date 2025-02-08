const express = require('express');
const cors = require('cors');
const db = require('./src/database');
const http = require("http");

// Using Apollo server express.
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");

// Add web socket server.
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

// GraphQL schema and resolvers.
const { typeDefs, resolvers } = require("./src/graphql");

// Sync our database, create table if needed.
db.syncToBackend();

// Create app and server.
async function startApolloServer() {
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Use json format.
  app.use(express.json());

  // Maybe unused.
  app.use(cors());

  // Initialize all the routers.
  require('./src/initRouters')(express, app);

  /* Code below copy from RMIT Further Web Programming week 11 pra examle. */

  // Setup GraphQL subscription server.
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Passing in an instance of a GraphQLSchema and
  // telling the WebSocketServer to start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  // Setup Apollo server.
  // Include plugin code to ensure all HTTP and subscription connections closed when the server is shutting down.
  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            }
          };
        }
      }]
  });

  // Start server.
  await server.start();
  server.applyMiddleware({ app });

  // 404 Page.
  app.all('*', (req, res) => {
    res.status(404).send('<h1>Not a valid url or unsupported operation.</h1>');
  });

  const PORT = 4000;
  await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
  console.log(`Middle layer listening port ${PORT}.`);
}

startApolloServer(typeDefs, resolvers).catch(console.log);
