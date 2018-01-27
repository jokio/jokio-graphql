# GraphQL Server (with jokio)
[![Build Status](https://travis-ci.org/jokio/jokio-graphql.svg?branch=master)](https://travis-ci.org/jokio/jokio-graphql)
[![engine: jokio](https://img.shields.io/badge/engine-%F0%9F%83%8F%20jokio-44cc11.svg)](https://github.com/jokio/jokio)

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
