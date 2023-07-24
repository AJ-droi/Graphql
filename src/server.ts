// server.ts
import express from 'express';
import mongoose, {ConnectOptions} from 'mongoose';
import bodyParser from 'body-parser';
import {ApolloServer} from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './graphql/schema';
import resolvers from './graphql/resolvers';


const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://ajiriosiobe:1234@cluster0.ivyydto.mongodb.net/';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true } as ConnectOptions)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  const testUrl = async () => {
    try{
      const {url}= await startStandaloneServer(server, {
        listen: { port: 3500 },
      });
      console.log(`🚀  Server ready at: ${url}`);
    }catch(err){
      console.log(err)
    }
  }

  testUrl()
  