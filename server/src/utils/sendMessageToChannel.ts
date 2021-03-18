import axios from 'axios'
import { Book } from '../entities/Book'
import { User } from '../entities/User'

type ExchangeInfo = {
  user: User;
  book: Book;
}

const omitString = (t: string) => {
  const max = 150;

  if (t.length > max) {
    return t.substr(0, max) + '...';
  }

  return t;
};

export const sendMessageToChannel = async (exc: ExchangeInfo) => {
  const { username } = exc.user;
  const { title, description, inforLink, img } = exc.book;

    const headers = {
      'Content-Type': 'application/json',
    }

    const block = [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*${username}が下記の本を借りたよ*\n${title}`,
          }
        },
        {
          "type": "section",
          "block_id": "section567",
          "text": {
            "type": "mrkdwn",
            "text": `<${inforLink}|Book Info> \n ${omitString(description)}`
          },
          "accessory": {
            "type": "image",
            "image_url": img,
            "alt_text": "book icon"
          }
        },
        {
          "type": "section",
          "block_id": "section789",
          "fields": [
            {
              "type": "mrkdwn",
              "text": "some coment"
            }
          ]
        }
    ]

    const data = {
      "text": "この本借ります！！",
      "blocks": [...block],
    }

    const { status } = await axios({
      method: 'post',
      url: process.env.SLACK_URL,
      data,
      headers
   })

   return status;
}
