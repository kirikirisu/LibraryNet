import DataLoader from 'dataloader';
import { User } from '../entities/User';

const batchUser = async (userIds: number[]) => {
  const users = await User.findByIds(userIds);
  const idToAdmin: Record<number, User> = {};
  users.forEach((user) => {
    idToAdmin[user.id] = user;
  });

  // idsの順番にソートする
  const sorted = userIds.map((userId) => idToAdmin[userId]);
  // console.log('sorted', sorted);
  return sorted;
};

export const createUserLoader = () => {
  return new DataLoader((userIds) => batchUser(userIds as number[]));
};
