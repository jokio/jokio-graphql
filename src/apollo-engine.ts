import { EngineConfig as ApolloEngineProps, Engine } from 'apollo-engine'
import { Context } from './context'
import { GraphqlProps } from '.';

export const apolloEngine = (props: GraphqlProps) => (state, context: Context) => {

	const { yogaServer } = context

	if (!yogaServer)
		throw new Error('Please run yoga server first')

	if (!props || !props.engine || !props.engine.apiKey)
		return state

	const { express } = yogaServer
	const { engine: engineConfig, endpoint, port: graphqlPort } = props

	// const engine = new Engine({
	// 	engineConfig,
	// 	endpoint,
	// 	graphqlPort,
	// })
	// engine.start();


	// express.use(engine.expressMiddleware());

	// context.engine = engine

	return state;
}
