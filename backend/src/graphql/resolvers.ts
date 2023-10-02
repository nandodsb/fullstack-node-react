import {GraphQLDate} from 'graphql-iso-date'
import GraphQLJSON from 'graphql-type-json'
import { prisma } from '../modules/db'
import { enqueue } from './queue'
import { times } from 'lodash'

export const resolvers = {
    DateTime: GraphQLDate,
    JSON: GraphQLJSON,

    Query: {
        submissions: () => {
           return  prisma.submission.findMany({orderBy: {submittedAt: 'desc'}})
        }
    },

    Mutation: {
        queueSubmissionGeneration: async (_:any, {count}: {count: number}) => {
            await Promise.all(times(count ?? 1).map(async () => {
                await enqueue(`generateSubmissions`)
            }));           
            return true
        }
    }
}

