import { EngineConfig } from 'apollo-engine';
import { compose, log } from "jokio";
import { yoga, YogaProps, yogaStart } from "./yoga";
import { apolloEngine } from "./apollo-engine";
import { Context } from "./context";
import { graphiql, GraphiqlProps } from "./graphiql";
import { merge } from "lodash";


const defaultGraphqlProps: GraphqlProps = {
	port: 3000,
	endpoint: '/graphql',
	subscriptions: '/graphql',
	playground: false,
	graphiql: {
		subscriptionEndpoint: 'ws://localhost:3000/graphql'
	}
}

export function graphql(props: GraphqlProps) {
	props = merge(defaultGraphqlProps, props)

	const graphiqlProcess = props.playground
		? state => state
		: graphiql(props.endpoint, props.graphiql)

	return compose(
		yoga(props),
		apolloEngine(props.engine),
		graphiqlProcess,
		yogaStart(props),
	)
}

export interface GraphqlProps extends YogaProps {
	engine?: EngineConfig
	graphiql?: GraphiqlProps
}

export { LocalSchema, Resolvers, Resolver } from './types'
export { Context } from './context'
export { RestAPI } from './common/restApi'
