import { GraphQLList, GraphQLObjectType, GraphQLString, GraphQLInputObjectType, GraphQLNonNull } from 'graphql';

export const user = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type:  GraphQLString },
    firstName: { type:  GraphQLString },
    lastName:  { type:  GraphQLString },
    email:  { type:  GraphQLString },
    subscribedToUserIds: { type: new GraphQLList(GraphQLString)},
  })
})

export const userInputType = new GraphQLInputObjectType({
  name: 'UserInput',
  fields: {
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }
});