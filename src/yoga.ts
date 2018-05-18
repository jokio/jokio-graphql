import { merge } from 'lodash';
import { Request } from 'express';
import { Options, GraphQLServer, PubSub } from 'graphql-yoga';
import { GraphQLSchema } from 'graphql';
import { mergeSchemas } from 'graphql-tools';
import { ConnectionContext } from 'subscriptions-transport-ws';

import coreModule from './modules/core';
import scalarModule from './modules/scalars';
import { LocalSchema } from './types';
import { Context, GraphContext } from "./context";
import { RestAPI } from './common/restApi';
import { getRemoteSchema } from './common/getRemoteSchema';
import * as auth from './common/auth';


const defaultProps: YogaProps = {
	playground: false,
	autoStart: false,
	localSchemas: [],
	remoteSchemaUrls: [],
	restApiUrls: {},
	authentication: {
		tokenName: 'token',
		getHttpToken: auth.getHttpToken,
		getWsToken: auth.getWsToken,
	}
}


export const yoga = (props: YogaProps) => async (state, context: Context) => {

	const {
		localSchemas,
		remoteSchemaUrls,
		restApiUrls,
		autoStart,
		disableCoreModule,
		disabledScalars,
		mocks,

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
	const connectionContextFn = async ({ request, connectionParams }): Promise<GraphContext> => {
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
		mocks,
		context: connectionContextFn
	})

	if (autoStart) {
		await yogaStart(props);
	}

	context.yogaServer = server
	context.pubsub = pubsub
	context.connectionContextFn = connectionContextFn

	return state
}

export const yogaStart = (props: YogaProps) => async (state, context: Context) => {
	const { yogaServer: server, connectionContextFn } = context;

	context.server = await server.start(props)

	// hack
	const subscriptionServer: any = server.subscriptionServer;
	if (subscriptionServer) {
		subscriptionServer.onOperation = null;
		subscriptionServer.onConnect = async (connectionParams) =>
			await connectionContextFn({ connectionParams, request: null });
	}
	// hack

	return state
}


// types
export interface YogaProps extends Options {
	localSchemas?: LocalSchema<any>[]
	remoteSchemaUrls?: string[]
	restApiUrls?: { [key: string]: string }
	autoStart?: boolean
	mocks?: Object | boolean

	disableCoreModule?: boolean
	disabledScalars?: boolean

	authentication?: Authentication
	contextObject?: any
}

export interface Authentication {
	tokenName?: string
	getHttpToken?: (request: Request, tokenName: string) => string
	getWsToken?: (connection: ConnectionContext, tokenName: string) => string
	getUserId?: (token: string, restApis: { [key: string]: RestAPI }) => Promise<number>
}

