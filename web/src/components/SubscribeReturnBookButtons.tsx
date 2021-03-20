import { useRouter } from 'next/router';
import { Button, Box } from '@chakra-ui/react';
import { useMeQuery, useSubscribeBookMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';
// import { useApolloClient } from '@apollo/client';

// TODO: type-graphqlでリテラルの指定が分かり次第、availableのtypeをgenする
const AVAILABLE_TYPE = {
  valid: 'valid',
  asking: 'asking',
  invalid: 'invalid',
};

interface SubscribeReturnBookButtonsProps {
  bookId: number;
}

// 本が借りられない状態ならdisable表示のサブスクボタン => book.availableがinvalid
// しかし自分がこの本を借りている人なら => 返すボタンを押せる => sharedBook.subscriberIdとdata.me.idで判断

// 本が借りられる状態ならサブスクボタン => book.availableがvalid
// ログインしていない人 => ボタンは押せるがアラートエラー => 通常のボタン表示
export const SubscribeReturnBookButtons: React.FC<SubscribeReturnBookButtonsProps> = ({
  bookId,
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

  // if () {}

  console.log('me');

  return (
    <Button
      alignSelf="flex-end"
      mt="6"
      mr="4"
      colorScheme="teal"
      variant="outline"
      onClick={async () => {
        console.log('bookId', bookId);
        // ログインしていない場合はのエラーはここで拾う
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
