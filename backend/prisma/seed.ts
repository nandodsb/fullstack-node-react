import { PrismaClient } from '@prisma/client'
import {randomUUID} from 'crypto'
const prisma = new PrismaClient({log: ['error', 'info', 'query', 'warn']})

export const genId = () => randomUUID()

async function main() {    
   
  if((await prisma.submission.count()) === 0) {
        await prisma.submission.createMany({
          data: [
            {
                      id: genId(),//                
                      submittedAt: new Date(),
                      data: {
                          name: "Fer",
                          twitter: "@fer"
                          }
                      },
                      {
                        id: genId(),//                
                        submittedAt: new Date(),
                        data: {
                            name: "Bea",
                            twitter: "@bea"
                            }
                        },
                  ],
              })
          }
        }     

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })