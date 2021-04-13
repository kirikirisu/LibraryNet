export const COOKIE_NAME = 'CID';
export const isDev = () => process.env.NODE_ENV === 'dev';
export const SLACK_REQUEST_HEADER = {
  'Content-Type': 'application/json',
  Authorization: process.env.SLACK_API_KEY,
};
