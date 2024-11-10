import {Prisma, PrismaClient} from "@prisma/client";
import logger from "./logger";

const prismaClient = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
        {
            emit: 'event',
            level: 'error',
        },
        {
            emit: 'event',
            level: 'info',
        },
        {
            emit: 'event',
            level: 'warn',
        },
    ],
})


prismaClient.$on('query', (e) => {
    logger.info(e);
});

prismaClient.$on('info', (e) => {
    logger.info(e);
});

prismaClient.$on('warn', (e) => {
    logger.warn(e);
});

prismaClient.$on('error', (e) => {
    logger.error(e);
});

export default prismaClient;
