import express from 'express';
import { Redis } from 'ioredis';
import { AllowList } from '../entities/AllowList';
import { ADMINISTOR_TOKEN_PREFIX } from '../constants';

export const addAllowUser = async (
  req: express.Request,
  res: express.Response,
  redis: Redis
) => {
  try {
    const { authorization: authToken } = req.headers;
    const { email } = req.body;

    if (!authToken) {
      res.send('please input token.');
      res.end();
      return;
    }

    if (!email || !email.includes('@')) {
      res.send('plese input email address');
      res.end();
      return;
    }
    if (!email.includes('planet.kanazawa-it')) {
      res.send('please input KIT mail address.');
      res.end();
      return;
    }

    const redisKey = ADMINISTOR_TOKEN_PREFIX + authToken;
    const username = await redis.get(redisKey);

    if (username) {
      console.log(redisKey, username);

      await AllowList.create({ email }).save();

      res.send('complete add user email');
      res.end();
      return;
    }

    res.send(
      'this token is valid. expired or incorrect. \n please get new token'
    );

    res.end();
  } catch (e) {
    console.log(e);
  }
};
