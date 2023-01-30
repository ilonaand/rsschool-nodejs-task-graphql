import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';
import { HttpError } from '@fastify/sensible/lib/httpError';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity | HttpError> {
      const userId = request.params.id;
     // if (!validate(userId)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');
      const user = await fastify.db.users.findOne({key:'id', equals:userId}); 
      if (!user) 
        throw fastify.httpErrors.notFound('This user does not exist!');
      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const userId = request.params.id;
      if (!validate(userId)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      const user = await fastify.db.users.findOne({key:'id', equals:userId}); 
      if (!user) 
        throw fastify.httpErrors.notFound('This user does not exist!');

      let subscribed = await fastify.db.users.findMany({key:'subscribedToUserIds', inArray:userId});
   
      subscribed.forEach(async(i) => {
          await fastify.db.users.change(i.id,
           {...i, subscribedToUserIds: i.subscribedToUserIds.filter(s => s !== userId) });
        } 
      );


      const posts = await fastify.db.posts.findMany({key: 'userId', equals:userId});
      posts.forEach(async(i) => await fastify.db.posts.delete(i.id));

      const profiles = await fastify.db.profiles.findMany({key: 'userId', equals:userId});
      profiles.forEach(async(i) => await fastify.db.profiles.delete(i.id));
      
      return fastify.db.users.delete(userId);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {

      const paramUser = await fastify.db.users.findOne({key:'id', equals:request.params.id});
      if (!paramUser) 
        throw fastify.httpErrors.notFound('This user does not exist!');
      
     if (!validate(request.body.userId)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      let bodyUser = await fastify.db.users.findOne({key:'id', equals:request.body.userId});
      if (!bodyUser) 
        throw fastify.httpErrors.notFound('This user does not exist!');

      const subscribedToUserIds = bodyUser.subscribedToUserIds;
      bodyUser = { ...bodyUser, subscribedToUserIds: [...subscribedToUserIds, request.params.id] }; 
      
      return await fastify.db.users.change(request.body.userId, bodyUser);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const paramUser = await fastify.db.users.findOne({key:'id', equals:request.params.id});

      if (!paramUser) 
        throw fastify.httpErrors.notFound('This user does not exist!');

      if (!validate(request.body.userId)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      let bodyUser = await fastify.db.users.findOne({key:'id', equals:request.body.userId});
      if (!bodyUser) 
        throw fastify.httpErrors.notFound('This user does not exist!');

        const subscribedToUserIds = bodyUser.subscribedToUserIds;
        if (!subscribedToUserIds.find(i => i === request.params.id)) 
          throw fastify.httpErrors.badRequest('badRequest: body.userId is valid but our user is not following him!');

        bodyUser = { ...bodyUser, subscribedToUserIds: subscribedToUserIds.filter(i => i !== request.params.id) };
           
        return await fastify.db.users.change(request.body.userId, bodyUser);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      if (!validate(request.params.id)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      const paramUser = await fastify.db.users.findOne({key:'id', equals:request.params.id});

      if (!paramUser) 
        throw fastify.httpErrors.notFound('This user does not exist!');
      return await fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
