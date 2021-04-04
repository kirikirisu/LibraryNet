import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { useMeQuery, useSubscribeBookMutation } from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface SubscribeReturnBookButtonsProps {
  bookId: number;
  publisherId: number;
  subscriberId: number;
  available: 'valid' | 'asking' | 'invalid';
}

export const SubscribeReturnBookButtons: React.FC<SubscribeReturnBookButtonsProps> = ({
  bookId,
  publisherId,
  available,
}) => {
  const router = useRouter();
  const [subscribe] = useSubscribeBookMutation();
  // const [returnBook] = useReturnBookMutation();

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

  // if (data.me?.id === subscriberId) {
  //   return (
  //     <Button
  //       alignSelf="flex-end"
  //       mt="6"
  //       mr="4"
  //       colorScheme="teal"
  //       variant="outline"
  //       onClick={async () => {
  //         try {
  //           const res = await returnBook({ variables: { id: bookId } });
  //           if (res.data?.returnBook) {
  //             router.push('/');
  //           } else {
  //             alert('faild by any problem');
  //           }
  //         } catch (err) {
  //           alert(err);
  //         }
  //       }}
  //     >
  //       return book
  //     </Button>
  //   );
  // }

  // console.log('me', data.me?.id, publisherId);
  if (data.me?.id === publisherId) {
    return null;
  }

  if (data.me === null) {
    return null;
  }

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
