const typeDefs = `#graphql
 type User {
  _id: ID!
  email: String!
  password: String!  # Note: In a real-world scenario, avoid exposing passwords in the schema.
}

type AuthPayload {
  token: String!
}

type Message {
  message: String!
}

type Query {
  getUsers: [User]
}

type Mutation {
  registerUser(email: String!, password: String!): AuthPayload!
  loginUser(email: String!, password: String!): AuthPayload!
  verifyOTP(userId: ID!, otp: String!): Message!
  updateUser(userId: ID!, newEmail: String, newPassword: String): Message!
  deleteUser(userId: ID!): Message!
}

schema {
  query: Query
  mutation: Mutation
}

`;

export default typeDefs