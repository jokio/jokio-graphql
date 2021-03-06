import { PubSub } from "graphql-subscriptions/dist/pubsub";
import { clearInterval } from "timers";
import { Resolvers } from "../types";
import { Context } from "../context";

export const SYSTEM_INFO_EVENT = 'SystemInfoEvent';

export const typeDefs = `
type Query {
	serverInfo: ServerInfo
}

type Mutation {
	startRealtimeServerInfo(interval: Int): Boolean
	stopRealtimeServerInfo: Boolean
}

type Subscription {
	serverInfo: ServerInfo
}

type ServerInfo {
	processId: Int
	startTime: DateTime
	upTime: ServerUpTime
	cpu: Float
	rssInMB: Float
	heapUsedInMB: Float
	heapTotalInMB: Float
}

type ServerUpTime {
	inSec: Float
	inMin: Float
	inHour: Float
	inDay: Float
}
`

const startTime = Date.now();
let realtimeServerInfoHandler = null;

export const resolvers: Resolvers<Context> = {
	Query: {
		serverInfo: async () => await getServerInfo()
	},

	Mutation: {
		startRealtimeServerInfo: (obj, { interval = 1000 }, { pubsub }) => {
			clearInterval(realtimeServerInfoHandler);

			interval = Math.max(100, interval);
			interval = Math.min(1000, interval);

			realtimeServerInfoHandler = setInterval(
				async () =>
					pubsub.publish(SYSTEM_INFO_EVENT, {
						serverInfo: await getServerInfo()
					})
				, interval
			);

			return true;
		},

		stopRealtimeServerInfo: () => clearInterval(realtimeServerInfoHandler),
	},

	Subscription: {
		serverInfo: {
			subscribe: (obj, props, { pubsub, token }) =>
				pubsub.asyncIterator(SYSTEM_INFO_EVENT)
		}
	}
}

export default {
	typeDefs,
	resolvers
}


function getServerInfo() {
	return new Promise((resolve, error) => {
		const memoryInfo = process.memoryUsage();
		const cpu = process.cpuUsage();

		const mb = 1024 * 1024;

		const systemInfo = {
			processId: process.pid,
			cpu: cpu.system / (1000 * 1000),
			rssInMB: memoryInfo.rss / mb,
			heapUsedInMB: memoryInfo.heapUsed / mb,
			heapTotalInMB: memoryInfo.heapTotal / mb,

			startTime: new Date(startTime),
			upTime: {
				inSec: (Date.now() - startTime) / (1000),
				inMin: (Date.now() - startTime) / (1000 * 60),
				inHour: (Date.now() - startTime) / (1000 * 60 * 60),
				inDay: (Date.now() - startTime) / (1000 * 60 * 60 * 24),
			}
		};

		resolve(systemInfo);
	});
}
