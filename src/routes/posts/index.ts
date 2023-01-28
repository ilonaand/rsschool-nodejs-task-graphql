import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<PostEntity[]> {
    return fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;
      const post = await fastify.db.posts.findOne({key:'id', equals:postId}); 
      if (!post) 
        throw fastify.httpErrors.notFound('This post does not exist!');
      return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      return fastify.db.posts.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;
      if (!validate(request.params.id)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');
      
      const post = await fastify.db.posts.findOne({key:'id', equals:postId}); 
      if (!post) 
        throw fastify.httpErrors.notFound('This post does not exist!');
      return fastify.db.posts.delete(postId);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<PostEntity> {
      const postId = request.params.id;
      if (!validate(request.params.id)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      const post = await fastify.db.posts.findOne({key:'id', equals:postId}); 
      if (!post) 
        throw fastify.httpErrors.notFound('This post does not exist!');
      return fastify.db.posts.change(postId, request.body);
    }
  );
};

export default plugin;
