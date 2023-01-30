import { 
  GraphQLID, 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInputObjectType, 
  GraphQLNonNull 
} from 'graphql';

export const post =  new  GraphQLObjectType ({
  name: 'Post',
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    userId: { type: GraphQLID },
  }),
});

export const postInputType = new GraphQLInputObjectType ({
  name: 'PostInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const postUpdateType = new GraphQLInputObjectType ({
  name: 'PostUpdate',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});