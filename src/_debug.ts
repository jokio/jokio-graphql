import { run } from 'jokio'
import { graphql, LocalSchema } from './index';

const schema: LocalSchema = {
	typeDefs: `
		extend type Query {
			hello: String
		}
	`,
	resolvers: {
		Query: {
			hello: () => 'world'
		}
	}
}

run(
	graphql({ localSchemas: [schema] })
)
