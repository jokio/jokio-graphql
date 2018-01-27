# GraphQL Server (with jokio)
[![Build Status](https://travis-ci.org/jokio/jokio-graphql.svg?branch=master)](https://travis-ci.org/jokio/jokio-graphql)

Example:
```js
import { run } from 'jokio'
import { graphql, LocalSchema } from 'jokio-graphql';

const schema: LocalSchema<any> = {
  typeDefs: `
    extend type Query {
      hello: String
    }
  `,
  resolvers: {
    Query: {
      hello: () => 'world'
    }
  }
}

run(
  graphql({ localSchemas: [schema] })
)
```