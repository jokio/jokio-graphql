import { EngineConfig as ApolloEngineProps, Engine } from 'apollo-engine'
import { Context } from "./context"

export const apolloEngine = (props: ApolloEngineProps) => (state, context: Context) => {

	const { yogaServer } = context

	if (!yogaServer)
		throw new Error('Please run yoga server first')

	if (!props || !props.apiKey)
		return state

	const { options: { endpoint, port }, express } = yogaServer

	const engine = new Engine({
		engineConfig: props,
		endpoint,
		graphqlPort: port,
	})
	engine.start();


	express.use(engine.expressMiddleware());

	context.engine = engine

	return state;
}
