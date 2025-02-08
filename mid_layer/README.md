# Middle Layer

## Basic Information

This project implements database connectivity, Rest API and GraphQL.
It acts as an intermediate layer to interact with the back-end and 
transmits the obtained data to the front-end. 
It also accepts and responds to requests from the front-end.

## Usage

Use **npm run** to start server.

## Why not typescript

Typescript may increase the complexity of this project. 
And it requires more time to learn. Considering that this is a 
separate project, using a different language will not pose a problem.

## Library

- apollo-server-express: Use for graphql server.
- argon2: Hash and verify password.
- cors: Unused.
- express: This framework is to help us create a middle layer server.
- express-graphql, graphql: Core for graphql.
- mariadb: Database driver. We not use mysql2, because this one is more suitable for our db server.
- nodemon: Restart server when file changed.
- sequelize: ORM library.
