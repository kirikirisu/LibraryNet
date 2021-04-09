import { Book } from '../entities/Book';
import { User } from '../entities/User';
import { omitString } from '../utils/omitString';

export const createDirectMessage = (
  subscriber: User,
  publisher: User,
  book: Book,
  returnBook: boolean
) => {
  let blocks;
  if (!returnBook) {
    const state = {
      publisherId: publisher.id,
      subscriberId: subscriber.id,
      bookId: book.id,
      ok: null,
    };

    blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${subscriber.username}が下記の本を借りたいようです`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${book.inforLink}|Book Info> \n ${omitString(
            book.description
          )}`,
        },
        accessory: {
          type: 'image',
          image_url: book.img,
          alt_text: 'book icon',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'OK!!',
            },
            style: 'primary',
            value: JSON.stringify({ ...state, ok: true }),
          },
          {
            type: 'button',
            text: {
              type: 'plain_text',
              emoji: true,
              text: 'NO...',
            },
            style: 'danger',
            value: JSON.stringify({ ...state, ok: false }),
          },
        ],
      },
    ];
  } else {
    blocks = [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `${subscriber.username}が下記の本を返しました`,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${book.inforLink}|Book Info> \n ${omitString(
            book.description
          )}`,
        },
        accessory: {
          type: 'image',
          image_url: book.img,
          alt_text: 'book icon',
        },
      },
    ];
  }

  return { blocks };
};
