import gql from 'graphql-tag'

export const schema = gql`
    scalar JSON
    scalar DateTime

    type Query {
    submissions: [Submission!]!
    }

    type Mutation {
        queueSubmissionGeneration(count: Int): Boolean!
    }

    type Submission {
    id: ID!
    submittedAt: DateTime!
    data: JSON!
    }
`
