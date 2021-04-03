export const COOKIE_NAME = 'CID';
export const __prod__ = process.env.NODE_ENV === 'production';
export const SLACK_REQUEST_HEADER = {
  'Content-Type': 'application/json',
  Authorization: process.env.SLACK_API_KEY,
};
