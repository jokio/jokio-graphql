import { run } from 'jokio'
import { graphql, LocalSchema } from './index';
import * as http from 'http'
import * as express from 'express'

const app: any = express();
const server = http.createServer(app);

const schema: LocalSchema = {
	typeDefs: `
		extend type Query {
			hello: String
			omg: String
		}
	`,
	resolvers: {
		Query: {
			hello: () => 'world',
			omg: () => ''
		}
	}
}

run(
	graphql({
		port: 3333,
		localSchemas: [schema],
		express: app,
		mocks: true,
	})
)
