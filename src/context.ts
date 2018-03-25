import { GraphQLServer, PubSub } from 'graphql-yoga';
import { Engine } from 'apollo-engine'
import { Server } from 'http';
import { Server as HttpsServer } from 'https';


export interface Context {
	server: Server | HttpsServer
	yogaServer: GraphQLServer
	pubsub: PubSub
	token: string
	engine: Engine
	connectionContextFn: any
}

export interface GraphContext {
	pubsub: PubSub
	token: string
	userId?: any
}
