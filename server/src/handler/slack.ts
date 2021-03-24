// this handler need https
// slackのメッセージで送ったボタンを押した時の処理
import axios from 'axios';
import { Request, Response } from 'express';
import { SharedBook } from '../entities/SharedBook';
import { getConnection } from 'typeorm';
import { Book } from '../entities/Book';

const headers = {
  'Content-Type': 'application/json',
};

type RequestValue = {
  publisherId: number;
  subscriberId: number;
  bookId: number;
  ok: boolean;
};

export const slack = async (req: Request, res: Response) => {
  console.log('------------------slack https reqest----------------');
  const payload = req.body.payload;
  if (!payload) return 'can not reseive slack action payload';

  const sr = JSON.parse(payload);
  console.log('slack reqest payload', sr);
  const url = sr.response_url;
  // valid or invalid
  const state: RequestValue = JSON.parse(sr.actions[0].value);
  console.log('state', state);
  console.log('stateOk', state.ok);

  if (state.ok) {
    // 本を貸す
    console.log('can lent');
    await getConnection()
      .createQueryBuilder()
      .update(Book)
      .set({
        available: 'invalid',
      })
      .where('id = :id', { id: state.bookId })
      .execute();

    await SharedBook.create({
      publisherId: state.publisherId,
      subscriberId: state.subscriberId,
      bookId: state.bookId,
    }).save();
  } else {
    // 本を貸せなかった場合も一旦有効にしとく
    console.log('can not lent');
    await getConnection()
      .createQueryBuilder()
      .update(Book)
      .set({
        available: 'valid',
      })
      .where('id = :id', { id: state.bookId })
      .execute();
  }

  // ボタンをメッセージに更新する
  const data = {
    replace_original: 'true',
    text: 'done!!!',
  };

  const { status } = await axios({
    method: 'post',
    url,
    headers,
    data,
  });
  console.log('status', status);
  return 'Ok, sucsess';
};
