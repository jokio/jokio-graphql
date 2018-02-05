
export interface LocalSchema<ContextType = any> {
	typeDefs: string
	resolvers: Resolvers<ContextType>
}

export interface Resolvers<ContextType> {
	[key: string]: Resolver<ContextType> | SubscriptionResolver<ContextType>
}

export interface Resolver<ContextType> {
	[key: string]: (obj, props, context: ContextType, info: any) => any
}

export interface SubscriptionResolver<ContextType> {
	[key: string]: {
		subscribe: (obj, props, context: ContextType, info: any) => any
	}
}
