import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    ProfileEntity[]
  > {
    return await fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;
      const profile = await fastify.db.profiles.findOne({key:'id', equals:profileId}); 
      if (!profile) 
        throw fastify.httpErrors.notFound('This profile does not exist!');
      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const user = await fastify.db.users.findOne({key:'id', equals:request.body.userId}); 

      if (user) throw fastify.httpErrors.badRequest('badRequest: user already has a profile!');
      return await fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;
      if (!validate(profileId)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      const profile = await fastify.db.profiles.findOne({key:'id', equals:profileId}); 
      if (!profile) 
        throw fastify.httpErrors.notFound('This profile does not exist!');
      
      return fastify.db.profiles.delete(profileId);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profileId = request.params.id;
      if (!validate(profileId)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');


      const profile = await fastify.db.profiles.findOne({key:'id', equals:profileId}); 
      if (!profile) 
        throw fastify.httpErrors.createError(404, 'This profile does not exist!');
      
      return fastify.db.profiles.change(profileId, request.body);
    }
  );
};

export default plugin;
