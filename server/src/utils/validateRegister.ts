import { RegisterInput } from '../types';

export const validateRejister = (options: RegisterInput) => {
  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'length must be greater than 2',
      },
    ];
  }

  if (!options.email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  if (options.username.includes('@')) {
    return [
      {
        field: 'username',
        message: 'cannot include an @',
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: 'password',
        message: 'length must be greater than 3',
      },
    ];
  }

  if (options.slackId.length <= 0) {
    return [
      {
        field: 'slackId',
        message: 'please input slackId',
      },
    ];
  }

  return null;
};
