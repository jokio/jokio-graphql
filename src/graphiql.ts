import { Context } from "./context";
import { graphiqlExpress } from 'apollo-server-express';


export const graphiql = (endpoint, props: GraphiqlProps) => (state, context: Context) => {

	const { yogaServer } = context

	if (!yogaServer)
		throw new Error('Please run yoga server first')

	const { express } = yogaServer
	const { subscriptionEndpoint, websocketConnectionParams } = props


	express.get(endpoint, graphiqlExpress({
		endpointURL: endpoint,
		subscriptionsEndpoint: subscriptionEndpoint,
		websocketConnectionParams
	}))

	return state
}


export interface GraphiqlProps {
	subscriptionEndpoint?: string
	websocketConnectionParams?: any
}
