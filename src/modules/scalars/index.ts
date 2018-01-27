import GraphQLJSON from './json';
import { GraphQLDate, GraphQLTime, GraphQLDateTime } from './datetime';
import { GraphQLScalarType } from 'graphql';

const typeDefs = `
scalar JSON
scalar Date
scalar Time
scalar DateTime
`;

const resolvers = {
	JSON: GraphQLJSON,
	Date: GraphQLDate,
	Time: GraphQLTime,
	DateTime: GraphQLDateTime,
};

export default {
	typeDefs,
	resolvers
}
