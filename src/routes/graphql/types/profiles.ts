import {
  GraphQLID,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInputObjectType,
  GraphQLNonNull

} from 'graphql';

export const profile = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: GraphQLString },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLString },
    userId: { type: GraphQLID }, 
  }),
});

export const profileInputType = new GraphQLInputObjectType({
  name: 'ProfileInput',
  fields: {
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString)  },
    street: { type: new GraphQLNonNull(GraphQLString)  },
    city: { type: new GraphQLNonNull(GraphQLString)  },
    memberTypeId: { type: new GraphQLNonNull(GraphQLString)  },
    userId: { type: new GraphQLNonNull(GraphQLID)  }, 
  }
});

export const profileUpdateType = new GraphQLInputObjectType({
  name: 'ProfileUpdate',
  fields: {
    id: { type: GraphQLID }, 
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString  },
    street: { type: GraphQLString },
    city: { type: GraphQLString  },
    memberTypeId: { type: GraphQLString },
  }
});