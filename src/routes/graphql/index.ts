import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import { 
  user,
  post, 
  memberType, 
  profile, 
  userInputType, 
  profileInputType,
  postInputType,
  userUpdateType,
  postUpdateType,
  profileUpdateType, 
  memberTypeUpdate,
  subscribedToUser,
  unsubscribedToUser, 
} from './types';

import {
  graphql,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLID,
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

          user: {
            type: user,
            args: {
              id: { type: GraphQLID },
            },
            async resolve(_, args) {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.id,
              });

              if (!user) {
                throw fastify.httpErrors.notFound('This user does not exist');
              }

              return user;
            },
          },

          profile: {
            type: profile,
            args: {
              id: { type: GraphQLID },
            },
            async resolve(_, args) {
              const profile = await fastify.db.profiles.findOne({
                key: 'id',
                equals: args.id,
              });

              if (!profile) {
                throw fastify.httpErrors.notFound('Profile does not exist');
              }

              return profile;
            },
          },

          post: {
            type: post,
            args: {
              id: { type: GraphQLID },
            },
            async resolve(_, args) {
              const post = await fastify.db.posts.findOne({
                key: 'id',
                equals: args.id,
              });

              if (!post) {
                throw fastify.httpErrors.notFound('Post does not exist');
              }

              return post;
            },
          },
          
          memberType: {
            type: memberType,
            args: {
              id: { type: GraphQLID },
            },
            async resolve(_, args) {
              const memberType = await fastify.db.memberTypes.findOne({
                key: 'id',
                equals: args.id,
              });

              if (!memberType) {
                throw fastify.httpErrors.notFound('MemberType does not exist');
              }

              return memberType;
            },
          },
        }
      }); 

      const rootMutation =  new GraphQLObjectType({
        name: 'Mutation',
        fields: {
          createUser: {
            type: user,
            args: { 
              user: { 
                type: new GraphQLNonNull(userInputType) 
              }
            },
            async resolve(_, args) {
              const user = await fastify.db.users.create({
                firstName: args.user.firstName, 
                lastName: args.user.lastName,
                email: args.user.email,
              });

              return user;
            },
          },

          createProfile: {
            type: profile,
            args: { 
              profile: { 
                type: new GraphQLNonNull(profileInputType) 
              }
            },
            async resolve(_, args) {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.profile.userId,
              });

              if (!user) {
                throw fastify.httpErrors.notFound('User does not exists');
              }

              const memberType = await fastify.db.memberTypes.findOne({
                key: 'id',
                equals: args.profile.memberTypeId,
              });

              if (!memberType) {
                throw fastify.httpErrors.notFound('MemberType does not exists');
              }

              const hasUserProfile = await fastify.db.profiles.findOne({
                key: 'userId',
                equals: args.profile.userId,
              });

              if (hasUserProfile) {
                throw fastify.httpErrors.badRequest('User already has a profile');
              }

              const profile = await fastify.db.profiles.create({
                avatar: args.profile.avatar,
                sex: args.profile.sex,
                birthday: args.profile.birthday,
                country: args.profile.country,
                street: args.profile.street,
                city: args.profile.city,
                userId: args.profile.userId,
                memberTypeId: args.profile.memberTypeId,
              });

              return profile;
            },
          },

          createPost: {
            type: post,
            args: { 
              post: { 
                type: new GraphQLNonNull(postInputType) 
              }
            },
            async resolve(_, args) {
              const user = await fastify.db.users.findOne({key:'id', equals:args.post.userId}); 
              if (!user) 
                throw fastify.httpErrors.notFound('User does not exist!');

              const post = await fastify.db.posts.create({
                  userId: args.post.userId,
                  title: args.post.title,
                  content: args.post.content,
                });

              return post;
            },
          },

          updateUser: {
            type: user,
            args: {
              user: {
                type: new GraphQLNonNull(userUpdateType)
              }
            },
            async resolve(_, args) {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.user.id,
              });

              if (!user) {
                throw fastify.httpErrors.notFound('User does not exist!');
              }

              const newUser = await fastify.db.users.change(args.user.id, args.user);

              return newUser;
            },
          },

          updateProfile: {
            type: profile,
            args: {
              profile: {
                type: new GraphQLNonNull(profileUpdateType)
              },
            },
            async resolve(_, args) {
              const profile = await fastify.db.profiles.findOne({
                key: 'id',
                equals: args.profile.id,
              });

              if (!profile) {
                throw fastify.httpErrors.notFound('Profile does not exist!');
              }

              const memberType = await fastify.db.memberTypes.findOne({
                key: 'id',
                equals: args.profile.memberTypeId,
              });

              if (!memberType && args.profile.memberTypeId) {
                throw fastify.httpErrors.notFound('MemberType does not exist!');
              }

              const newProfile = await fastify.db.profiles.change(
                args.profile.id,
                args.profile,
              );

              return newProfile;
            },
          },

          updatePost: {
            type: post,
            args: {
              post: { type: new GraphQLNonNull(postUpdateType) },
            },
            async resolve(_, args) {
              const post = await fastify.db.posts.findOne({
                key: 'id',
                equals: args.post.id,
              });

              if (!post) {
                throw fastify.httpErrors.notFound('Post does not exist!');
              }

              const newPost = await fastify.db.posts.change(args.post.id, args.post);

              return newPost;
            },
          },

          updateMemberTypes: {
            type: memberType,
            args: {
              memberType: { type: memberTypeUpdate }
            },
            async resolve(_, args) {
              const memberType = await fastify.db.memberTypes.findOne({
                key: 'id',
                equals: args.memberType.id,
              });

              if (!memberType) {
                throw fastify.httpErrors.notFound('MemberType does not exist!');
              }

              const newMemberType = await fastify.db.memberTypes.change(
                args.memberType.id,
                args.memberType,
              );

              return newMemberType;
            },
          },
          subscribedToUser: {
            type: user,
            args: {
              toUser: { type: subscribedToUser },
            },
            async resolve(_, args) {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.toUser.id,
              });

              if (!user) {
                throw fastify.httpErrors.notFound('User does not exist!');
              }

              const subscribeToUser = await fastify.db.users.findOne({
                key: 'id',
                equals: args.toUser.subscribedToUserId,
              });

              if (!subscribeToUser) {
                throw fastify.httpErrors.notFound(
                  'subscribeToUser does not exist!',
                );
              }

              if (args.toUser.id === args.toUser.subscribedToUserId) {
                throw fastify.httpErrors.badRequest('You try subscribe to yourself');
              }

              if (subscribeToUser.subscribedToUserIds.includes(args.toUser.id)) {
                throw fastify.httpErrors.badRequest('User already subscribed');
              }

              const updateUser = await fastify.db.users.change(
                args.toUser.subscribedToUserId,
                {
                  subscribedToUserIds: [
                    ...subscribeToUser.subscribedToUserIds,
                    args.toUser.id,
                  ],
                },
              );

              return updateUser;
            },
          },
          unsubscribedToUser: {
            type: user,
            args: {
             toUser: { type: unsubscribedToUser }
            },
            async resolve(_, args) {
              const user = await fastify.db.users.findOne({
                key: 'id',
                equals: args.toUser.id,
              });

              if (!user) {
                throw fastify.httpErrors.notFound('User does not exist!');
              }

              let unsubscribeToUser = await fastify.db.users.findOne({
                key: 'id',
                equals: args.toUser.unsubscribedToUserId,
              });

              if (!unsubscribeToUser) {
                throw fastify.httpErrors.notFound(
                  'unsubscribeToUser does not exist!',
                );
              }

              if (args.toUser.id === args.toUser.unsubscribedToUserId) {
                throw fastify.httpErrors.badRequest(
                  'You try unsubscribe to yourself',
                );
              }

              try {
                const subscribedToUserIds = unsubscribeToUser.subscribedToUserIds;
                if (!subscribedToUserIds.find(i => i === args.toUser.id)) 
                  throw fastify.httpErrors.badRequest('userId is valid but our user is not following him!');

                unsubscribeToUser = { ...unsubscribeToUser, 
                  subscribedToUserIds: subscribedToUserIds.filter(i => i !== args.toUser.id) };

                const updateUser = await fastify.db.users.change(
                  args.toUser.unsubscribedToUserId,
                  {
                    subscribedToUserIds:
                      unsubscribeToUser.subscribedToUserIds,
                  },
                );

                return updateUser;
              } catch (err: any) {
                throw fastify.httpErrors.badRequest(err.message);
              }
            },
          },
        },
      });
      
      const schema = new GraphQLSchema({ query: RootQuery, mutation: rootMutation });
      return await graphql({ schema, source: request.body.query!, variableValues: request.body.variables });
    }
  );
};

export default plugin;
