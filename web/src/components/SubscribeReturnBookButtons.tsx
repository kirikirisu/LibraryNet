import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { useMeQuery, useSubscribeBookMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface SubscribeReturnBookButtonsProps {
  bookId: number;
  subscriberId: number;
  available: 'valid' | 'asking' | 'invalid';
}

// 本が借りられない状態ならdisable表示のサブスクボタン => book.availableがinvalid
// しかし自分がこの本を借りている人なら => 返すボタンを押せる => sharedBook.subscriberIdとdata.me.idで判断

// 本が借りられる状態ならサブスクボタン => book.availableがvalid
// ログインしていない人 => ボタンは押せるがアラートエラー => 通常のボタン表示
export const SubscribeReturnBookButtons: React.FC<SubscribeReturnBookButtonsProps> = ({
  bookId,
  subscriberId,
  available,
}) => {
  const router = useRouter();
  const [subscribe] = useSubscribeBookMutation();

  // キャッシュから取得もできる
  // 初回にこのページにこられてしまうとキャッシュがないためnullになってしまう
  // const apolloClient = useApolloClient();
  // const me = apolloClient.readQuery({
  //   query: MeDocument,
  // });

  // キャッシュがあればキャッシュを使い
  // なければクエリを叩いてくれる
  const { data, loading, error } = useMeQuery({ skip: isServer() });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>can not get data</p>;
  // console.log('sub me', data.me?.id, subscriberId);

  if (data.me?.id === subscriberId) {
    return (
      <Button
        alignSelf="flex-end"
        mt="6"
        mr="4"
        colorScheme="teal"
        variant="outline"
      >
        return book
      </Button>
    );
  }

  console.log('me');

  return (
    <Button
      alignSelf="flex-end"
      mt="6"
      mr="4"
      colorScheme="teal"
      variant="outline"
      disabled={available === 'invalid'}
      onClick={async () => {
        try {
          const res = await subscribe({ variables: { id: bookId } });
          if (res.data?.subscribeBook.errors) {
            alert(res.data.subscribeBook.errors);
          } else {
            router.push('/');
          }
        } catch (err) {
          alert(err);
        }
      }}
    >
      subscribe book
    </Button>
  );
};
