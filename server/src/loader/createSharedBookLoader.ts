import DataLoader from 'dataloader';
import { SharedBook } from '../entities/SharedBook';

// それぞれのbookIdsにそれぞれのsubscriberaidが対応している必要がある。(dataloaderの制約)
// TODO: 返り値と引数の配列の順番が同じ && 同じ長さになるかテストする
const batchSharedBooks = async (bookIds: number[]) => {
  const sharedBooks = await SharedBook.findByIds(bookIds);
  console.log('sharedBooks', sharedBooks);
  // console.log("sharedBooks len", sharedBooks.length)

  const bookIdsToSubscriberIds: Record<any, any> = {};
  sharedBooks.forEach((sb) => {
    bookIdsToSubscriberIds[sb.bookId] = sb.subscriberId || null;
  });
  console.log('bookIdsToSubscriberIds', bookIdsToSubscriberIds);

  const sorted = bookIds.map((id) => bookIdsToSubscriberIds[id] || null);
  console.log('sorted', sorted);

  // const subscriberIds: number[] = []
  // sharedBooks.forEach((shared) => {
  //   subscriberIds.push(shared.subscriberId)
  // })
  // console.log("subscriberIds",subscriberIds)
  // console.log("subscriberIds len",subscriberIds.length)

  return sorted;
};

export const createSharedBookLoader = () =>
  new DataLoader((ids) => batchSharedBooks(ids as number[]));
