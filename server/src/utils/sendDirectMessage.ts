import axios from 'axios';
import { User } from '../entities/User';
import { getChannelID } from './getChannelID';

export const sendDirectMessage = async (
  publisher: User,
  subscriber: User,
  blocks: any
) => {
  // create room & get channelId or get channelId
  const channelId = await getChannelID(publisher.slackId, subscriber.slackId);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: process.env.SLACK_API_KEY,
  };

  const data = {
    channel: channelId,
    blocks,
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
