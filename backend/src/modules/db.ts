import { PrismaClient } from '@prisma/client'
import {randomUUID} from 'crypto'

export const prisma = new PrismaClient({log: ['error', 'info', 'query', 'warn']})

export const genId = () => randomUUID()