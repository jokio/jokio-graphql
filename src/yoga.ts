import { merge } from 'lodash';
import { Options, GraphQLServer, PubSub } from 'graphql-yoga';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { IResolvers } from 'graphql-yoga/dist/src/types';
import { ConnectionContext } from 'subscriptions-transport-ws';

import coreModule from './modules/core';
import scalarModule from './modules/scalars';

import { Context } from "./context";
import { RestAPI } from './common/restApi';
import { getRemoteSchema } from './common/getRemoteSchema';


const defaultProps: YogaProps = {
	tracing: { mode: 'http-header' },
	playground: false,
	autoStart: false
}


export const yoga = (props: YogaProps) => async (state, context: Context) => {

	const {
		localSchemas = [],
		remoteSchemaUrls = [],
		restApiUrls = [],
		autoStart = false,
		disableCoreModule,
		disabledScalars,

		authentication,
		contextObject,

	} = props = merge(defaultProps, props);


	if (!disableCoreModule) {
		localSchemas.unshift(coreModule);
	}

	if (!disabledScalars) {
		localSchemas.unshift(scalarModule);
	}


	let typeDefs = localSchemas.map(x => x.typeDefs).join() || '';
	let resolvers = localSchemas.length ? (localSchemas.map(x => x.resolvers).reduce(merge) || {}) : {};
	let remoteSchemas = [];

	for (let url of remoteSchemaUrls) {
		remoteSchemas.push(await getRemoteSchema(url));
	}

	const schema = !remoteSchemas.length ? undefined : mergeSchemas({
		schemas: [...remoteSchemas, typeDefs],
		resolvers: resolvers
	})


	const restApis = {};
	for (let key in restApiUrls) {
		restApis[key] = new RestAPI(restApiUrls[key]);
	}


	const pubsub = new PubSub();
	const connectionContextFn = async ({ request, connectionParams }) => {
		let token = null;
		let userId = null;

		if (authentication) {
			const {
				tokenName,
				getHttpToken,
				getWsToken,
				getUserId
			} = authentication;

			if (request)
				token = getHttpToken(request, tokenName);

			if (connectionParams)
				token = getWsToken(connectionParams, tokenName);

			if (getUserId && token)
				userId = await getUserId(token, restApis);
		}

		return {
			token,
			userId,
			pubsub,
			...restApis,
			...contextObject,
		}
	};

	const server = new GraphQLServer({
		schema,
		typeDefs,
		resolvers,
		context
	})

	if (autoStart) {
		await yogaStart(props);
	}

	context.yogaServer = server
	context.pubsub = pubsub
	context.connectionContextFn = connectionContextFn
	context.express = server.express

	return state
}

export const yogaStart = (props: YogaProps) => async (state, context: Context) => {
	const { yogaServer: server, connectionContextFn } = context;

	console.log(props.subscriptions)
	await context.yogaServer.start(props)

	// hack
	const subscriptionServer: any = server.subscriptionServer;
	subscriptionServer.onOperation = null;
	subscriptionServer.onConnect = async (connectionParams) =>
		await connectionContextFn({ connectionParams, request: null });
	// hack

	return state
}


// types
export interface YogaProps extends Options {
	localSchemas?: LocalSchema<any>[]
	remoteSchemaUrls?: string[]
	restApiUrls?: { [key: string]: string }
	autoStart?: boolean

	disableCoreModule?: boolean
	disabledScalars?: boolean

	authentication?: Authentication
	contextObject?: any
}

export interface Authentication {
	tokenName: string
	getHttpToken: (request: Request, tokenName: string) => string
	getWsToken: (connection: ConnectionContext, tokenName: string) => string
	getUserId?: (token: string, restApis: { [key: string]: RestAPI }) => number
}


export interface LocalSchema<ContextType> {
	typeDefs: string
	resolvers: Resolvers<ContextType>
}

export interface Resolvers<ContextType> {
	[key: string]: any | Resolver<ContextType> | SubscriptionResolver<ContextType>
}

export interface Resolver<ContextType> {
	[key: string]: (obj, props, context: ContextType, info: any) => any
}

export interface SubscriptionResolver<ContextType> {
	[key: string]: {
		subscribe: (obj, props, context: ContextType, info: any) => any
	}
}
