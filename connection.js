//connection with ioredis: client to talk with redis
//publish or subscribe from redis server (two servers)
import { Redis } from "ioredis";

//publish to redis
export const redisPublish = new Redis({
  host: "localhost",
  port: 6379,
});

//subscribe to redis
export const redisSubsribe = new Redis({
  host: "localhost",
  port: 6379,
});
