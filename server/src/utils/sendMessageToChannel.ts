import axios from 'axios';

export const sendMessageToChannel = async (channelId: string, blocks: any) => {
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
    headers,
    url: 'https://slack.com/api/chat.postMessage',
    data,
  });

  return status;
};
