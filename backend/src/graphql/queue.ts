import { Queue, Worker } from 'bullmq';
import { ModGenerate } from '../modules/generate';

const queue_name = 'default'

if(!process.env.REDIS_HOST) console.warn('Redis is not defined')

const connection = {
    host: process.env.REDIS_HOST
}
export const queue = new Queue(queue_name, {connection});

// async function addJobs() {
//   await queue.add('myJobName', { foo: 'bar' });  
// }

const worker = new Worker(queue_name, async (job) => {
    if (job.name === 'generateSubmissions') {
        const submission = await ModGenerate.submission()
        console.log(submission)
    }
  }, {
    connection
  })


type JobName = 'generateSubmissions'

export const enqueue = async (job: JobName, data?: any) => {
    await queue.add(job, data)
}
