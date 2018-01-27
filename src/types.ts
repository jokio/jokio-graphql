
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
