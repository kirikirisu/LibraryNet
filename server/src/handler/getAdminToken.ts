import express from 'express';
import argon2 from 'argon2';
import { Administor } from '../entities/Administor';
import { v4 } from 'uuid';
// import { Redis } from 'ioredis';
// import { ADMINISTOR_TOKEN_PREFIX } from '../constants';

export const getAdminToken = async (
  req: express.Request,
  res: express.Response
  // redis: Redis
) => {
  try {
    const { username, password: rawPass } = req.body;

    const administor = await Administor.findOne({ where: { username } });

    if (!administor) {
      res.send('administor not found.');
      res.end();
      return;
    }
    const valid = await argon2.verify(administor.password, rawPass);
    if (!valid) {
      res.send('incorrect password.');
      res.end();
      return;
    }

    const token = v4();
    // const expireMiniutes = 1000 * 60 * 5;

    // await redis.set(
    //   ADMINISTOR_TOKEN_PREFIX + token,
    //   administor.username,
    //   'ex',
    //   expireMiniutes
    // );

    res.send(
      `success!! you could get token. \n this token has an expiration date of 5 miniutes. \n \n ${token} \n`
    );
    res.end();
  } catch (e) {
    console.log('async error', e);
  }
};
