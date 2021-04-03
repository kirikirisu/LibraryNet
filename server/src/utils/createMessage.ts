import { Book } from '../entities/Book';
import { User } from '../entities/User';

const omitString = (t: string) => {
  const max = 150;

  if (t.length > max) {
    return t.substr(0, max) + '...';
  }

  return t;
};

type MessageOption = {
  returnBook?: boolean;
};

export const createMessage = (
  subscriber: User,
  book: Book,
  returnBook: boolean
) => {
  const { username } = subscriber;
  const { title, description, inforLink, img } = book;

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: returnBook
          ? `*${username}が下記の本を返したよ*\n${title}`
          : `*${username}が下記の本を借りたよ*\n${title}`,
      },
    },
    {
      type: 'section',
      block_id: 'section567',
      text: {
        type: 'mrkdwn',
        text: `<${inforLink}|Book Info> \n ${omitString(description)}`,
      },
      accessory: {
        type: 'image',
        image_url: img,
        alt_text: 'book icon',
      },
    },
    // {
    //   "type": "section",
    //   "block_id": "section789",
    //   "fields": [
    //     {
    //       "type": "mrkdwn",
    //       "text": "some coment"
    //     }
    //   ]
    // }
  ];

  return { blocks };
};
