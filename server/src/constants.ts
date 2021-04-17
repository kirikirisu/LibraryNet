export const COOKIE_NAME = 'CID';
export const isContainer = () => process.env.NODE_ENV === 'container';

export const SLACK_REQUEST_HEADER = {
  'Content-Type': 'application/json',
  Authorization: process.env.SLACK_API_KEY,
};
