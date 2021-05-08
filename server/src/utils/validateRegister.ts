import { AllowList } from '../entities/AllowList';
import { RegisterInput } from '../types';

export const validateRejister = async (options: RegisterInput) => {
  const { email } = options;
  const allowUser = await AllowList.findOne({
    where: { email: email },
  });

  if (!allowUser && email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'このメールアドレスは登録できません',
      },
    ];
  }

  if (!email.includes('@')) {
    return [
      {
        field: 'email',
        message: 'invalid email',
      },
    ];
  }

  if (options.username.length <= 2) {
    return [
      {
        field: 'username',
        message: 'length must be greater than 2',
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
