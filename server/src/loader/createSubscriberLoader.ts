import DataLoader from 'dataloader';
import { User } from '../entities/User';
import { SharedBook } from '../entities/SharedBook';

// それぞれのbookIdsにそれぞれのsubscriberaidが対応している必要がある。(dataloaderの制約)
// TODO: 返り値と引数の配列の順番が同じ && 同じ長さになるかテストする
const batchSubscribers = async (bookIds: number[]) => {
  // --------------------- get subscriberIds -------------------------
  const sharedBooks = await SharedBook.findByIds(bookIds);
  // console.log('sharedBooks', sharedBooks);

  const bookIdsToSubscriberIds: Record<any, any> = {};
  sharedBooks.forEach((sb) => {
    bookIdsToSubscriberIds[sb.bookId] = sb.subscriberId;
  });
  // console.log('bookIdsToSubscriberIds', bookIdsToSubscriberIds);

  const sortedSubscriberIds = bookIds.map(
    (id) => bookIdsToSubscriberIds[id] || null // null or -1
  );
  console.log('sortedSubscriberIds', sortedSubscriberIds);

  // --------------------- get subscribers --------------------------
  const subscribers = await User.findByIds(sortedSubscriberIds);
  // 例えば、[24, 24, 24]とか[24, -1, 24, 24, -1]とかだった場合subsciberIdは全て同じ値のため,
  // 変数subscribersには[User, User, User]ではなく、[User]になっている↓
  // console.log(subscribers.length);

  const subscriberIdsToSubscriber: Record<any, any> = {};
  subscribers.forEach((sub) => {
    subscriberIdsToSubscriber[sub.id] = sub;
  });

  // 上記でsubscriberIdが全て同じ値で、findByIdsにより配列の長さが変わったとしても
  // 下記のmapで修正できる
  const sortedSubscriber = sortedSubscriberIds.map((id) => {
    // if (id === -1) return null;
    return subscriberIdsToSubscriber[id] || null;
  });
  // console.log('sortedSubscriber', sortedSubscriber);

  return sortedSubscriber;
};

export const createSubscriberLoader = () =>
  new DataLoader((ids) => batchSubscribers(ids as number[]));
