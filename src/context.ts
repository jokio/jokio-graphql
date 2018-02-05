import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Engine } from 'apollo-engine'


export interface Context {
	yogaServer: GraphQLServer
	pubsub: PubSub
	token: string
	engine: Engine
	connectionContextFn: any
}

export interface GraphqlContext {
	pubsub: PubSub
	token: string
	userId?: any
}
