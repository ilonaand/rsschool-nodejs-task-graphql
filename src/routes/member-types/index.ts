import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import { validate } from 'uuid';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<
    MemberTypeEntity[]
  > {
    return await fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = request.params.id;
      const memberType = await fastify.db.memberTypes.findOne({key:'id', equals:memberTypeId}); 
      if (!memberType) 
        throw fastify.httpErrors.notFound('This memberType does not exist!');
      return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<MemberTypeEntity> {
      const memberTypeId = request.params.id;
      if (!validate(request.params.id)) throw fastify.httpErrors.badRequest('badRequest: id not validate!');

      const memberType = await fastify.db.memberTypes.findOne({key:'id', equals:memberTypeId}); 
      if (!memberType) 
        throw fastify.httpErrors.notFound('This memberType does not exist!');
      
      return fastify.db.memberTypes.change(memberTypeId, request.body);
    }
  );
};

export default plugin;
