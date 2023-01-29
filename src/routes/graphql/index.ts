import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { user, post, memberType, profile } from './types';

import {
  graphql,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const RootQuery = new GraphQLObjectType({
        name: 'query',
        fields: {
          users: {
            type: new GraphQLList(user),
            resolve () {
              return  fastify.db.users.findMany();
            },
          },
          profiles: {
            type: new GraphQLList(profile),
            resolve() {
              return fastify.db.profiles.findMany();
            },
          },
          posts: {
            type: new GraphQLList(post),
            resolve() {
              return fastify.db.posts.findMany();
            },
          },
          memberTypes: {
            type: new GraphQLList(memberType),
            resolve() {
              return fastify.db.memberTypes.findMany();
            },
          },
        }}
      ); 

      const roorMutation =  new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          createUser: {
            type: user,
            args: {
              firstName: { type: new GraphQLNonNull(GraphQLString) },
              lastName: { type: new GraphQLNonNull(GraphQLString) },
              email: { type: new GraphQLNonNull(GraphQLString) },
            },
            async resolve(_, args) {
              const user = await fastify.db.users.create({
                firstName: args.firstName,
                lastName: args.lastName,
                email: args.email,
              });

              return user;
            },
          },
        },
      });
      const schema = new GraphQLSchema({ query: RootQuery, mutation: roorMutation });
      return await graphql({ schema, source: request.body.query! });
    }
  );
};

export default plugin;
