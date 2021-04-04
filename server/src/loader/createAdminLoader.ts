import DataLoader from 'dataloader';
import { User } from '../entities/User';

const batchAdmin = async (adminIds: number[]) => {
  const admins = await User.findByIds(adminIds);
  const idToAdmin: Record<number, User> = {};
  admins.forEach((admin) => {
    idToAdmin[admin.id] = admin;
  });

  // idsの順番にソートする
  const sorted = adminIds.map((adminId) => idToAdmin[adminId]);
  // console.log('sorted', sorted);
  return sorted;
};

export const createAdminLoader = () => {
  return new DataLoader((adminIds) => batchAdmin(adminIds as number[]));
};
