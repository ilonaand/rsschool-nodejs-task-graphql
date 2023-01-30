import { 
  GraphQLInt, 
  GraphQLObjectType, 
  GraphQLString, 
  GraphQLInputObjectType, 
  GraphQLNonNull
 } from 'graphql';

export const memberType = new GraphQLObjectType( {
  name: 'MemberType',
  fields: () => ({
    id: { type: GraphQLString },
    discount: { type: GraphQLInt },
    monthPostsLimit:  { type: GraphQLInt },
    }),
  });

export const  memberTypeUpdate = new  GraphQLInputObjectType( {
  name: 'MemberTypeUpdate',
  fields: () => ({
    id: { type: new GraphQLNonNull (GraphQLString) },
    discount: { type: GraphQLInt },
    monthPostsLimit:  { type: GraphQLInt },
  }),
}

)
