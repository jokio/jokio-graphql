import { GraphQLSchema } from "graphql";
import { mergeSchemas, introspectSchema, makeRemoteExecutableSchema } from 'graphql-tools';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';


export async function getRemoteSchema(uri): Promise<GraphQLSchema> {
	const link = new HttpLink({ uri, fetch })
	const introspectionSchema = await introspectSchema(link);
	const remoteSchema = makeRemoteExecutableSchema({
		schema: introspectionSchema,
		link
	});

	return remoteSchema;
}
