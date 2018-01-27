# GraphQL Server
[![Build Status](https://travis-ci.org/jokio/jokio-graphql.svg?branch=master)](https://travis-ci.org/jokio/jokio-graphql)
[![npm version](https://badge.fury.io/js/jokio-graphql.svg)](https://badge.fury.io/js/jokio-graphql)
[![engine: jokio](https://img.shields.io/badge/engine-%F0%9F%83%8F%20jokio-44cc11.svg)](https://github.com/jokio/jokio)


High level package built on top of [graphql-yoga](https://github.com/graphcool/graphql-yoga), to create graphql server with websocket support easily.

## Features:
* All [graphql-yoga](https://github.com/graphcool/graphql-yoga) features
* Authentication support
* Apollo Engine support
* Pre-defined scalar types: Date, Time, DateTime, JSON
* Pre-defined Graph for getting server stats
* Remote Schema stitching
* Local Schema stitching
* Rest apis integration
* Dotenv support (for development environment)
* Web sockets improved support


## Example:
```js
import { run } from 'jokio'
import { graphql, LocalSchema } from 'jokio-graphql';

const schema: LocalSchema = {
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
