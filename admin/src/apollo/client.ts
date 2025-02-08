import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from 'graphql-ws';
import { ApolloClient, InMemoryCache } from "@apollo/client";

// These code are borrow from RMIT Further Web Programming week 11 pra example code.
const GRAPHQL_ENDPOINT = "ws://localhost:4000/graphql";

const link = new GraphQLWsLink(
  createClient({
    url: GRAPHQL_ENDPOINT,
  })
);

const cache = new InMemoryCache();

const CLIENT = new ApolloClient({ link, cache });
export default CLIENT;
