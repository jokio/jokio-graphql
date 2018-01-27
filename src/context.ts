import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Engine } from 'apollo-engine'


export interface Context {
	yogaServer: GraphQLServer
	pubsub: PubSub
	engine: Engine
	express: Express.Application
	connectionContextFn: any
}
