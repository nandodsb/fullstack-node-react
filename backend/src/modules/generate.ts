import {faker} from '@faker-js/faker'
import { prisma, genId } from "./db"
import {random} from 'lodash'

const submission = async () => {
    return prisma.submission.create({
        data: {
            id: genId(),
            submittedAt: new Date(),
            data: {
                name: faker.person.firstName(),
                email: faker.internet.email(),
                company: faker.company.name(),
                comments: faker.lorem.words(random(30, false)),
                twitter: faker.internet.userName(),
            }
        }        
    })
}


export const ModGenerate = {
    submission
}
