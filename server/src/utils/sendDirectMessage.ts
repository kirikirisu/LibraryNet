import axios from 'axios';
import { Book } from '../entities/Book';
import { User } from '../entities/User';
import { getChannelID } from './getChannelID';

const omitString = (t: string) => {
  const max = 150;

  if (t.length > max) {
    return t?.substr(0, max) + '...';
  }

  return t;
};

export const sendDirectMessage = async (
  publisher: User,
  subscriber: User,
  book: Book
) => {
  // create room & get channelId or get channelId
  const channelId = await getChannelID(publisher.slackId, subscriber.slackId);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: process.env.SLACK_API_KEY,
  };

  const block = [
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
          value: 'valid',
        },
        {
          type: 'button',
          text: {
            type: 'plain_text',
            emoji: true,
            text: 'NO...',
          },
          style: 'danger',
          value: 'invalid',
        },
      ],
    },
  ];

  const data = {
    channel: channelId,
    blocks: [...block],
  };

  const { status } = await axios({
    method: 'post',
    url: 'https://slack.com/api/chat.postMessage',
    data,
    headers,
  });

  if (status === 200) {
    return true;
  }
  return false;
};
