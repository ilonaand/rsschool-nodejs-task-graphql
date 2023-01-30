import { 
  GraphQLList, 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInputObjectType, 
  GraphQLNonNull, 
  GraphQLID 
} from 'graphql';

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

export const userUpdateType = new GraphQLInputObjectType({
  name: 'UserUpdate',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }
});

export const subscribedToUser = new GraphQLInputObjectType({
  name: 'SubscribedToUser',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    subscribedToUserId: { type: new GraphQLNonNull(GraphQLID) },
  }
});

export const unsubscribedToUser = new GraphQLInputObjectType({
  name: 'UnsubscribedToUser',
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    unsubscribedToUserId: { type: new GraphQLNonNull(GraphQLID) },
  }
});