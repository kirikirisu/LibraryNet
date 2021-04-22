import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import {
  useMeQuery,
  useSubscribeBookFromIndividualMutation,
  useSubscribeBookFromOrganizationMutation,
} from '../generated/graphql';
import { isServer } from '../utils/isServer';

interface SubscribeBookButtonProps {
  bookId: number;
  publisherId: number;
  available: 'valid' | 'asking' | 'invalid' | string;
  organization: boolean;
}

export const SubscribeBookButton: React.FC<SubscribeBookButtonProps> = ({
  bookId,
  publisherId,
  available,
  organization,
}) => {
  console.log('from button', organization);
  const router = useRouter();

  const [
    subscribeFromOrganization,
  ] = useSubscribeBookFromOrganizationMutation();
  const [subscribeFromIndividual] = useSubscribeBookFromIndividualMutation();

  // キャッシュがあればキャッシュを使い
  // なければクエリを叩いてくれる
  const { data, loading, error } = useMeQuery({ skip: isServer() });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>can not get data</p>;

  if (data.me?.id === publisherId) {
    return null;
  }

  if (data.me === null) {
    return null;
  }

  // 組織から本を借りる場合
  if (organization) {
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
            const res = await subscribeFromOrganization({
              variables: { id: bookId },
              update: (cache, data) => {
                console.log('cache', cache);
                console.log('data', data);
              },
            });

            if (res.data?.subscribeBookFromOrganization.errors) {
              alert(res.data?.subscribeBookFromOrganization.errors);
            } else {
              // router.push('/');
            }
          } catch (err) {
            alert(err);
          }
        }}
      >
        subscribe book
      </Button>
    );
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
          const res = await subscribeFromIndividual({
            variables: { id: bookId },
            update: (cache, data) => {
              console.log('cache', cache);
              console.log('data', data);
            },
          });

          if (res.data?.subscribeBookFromIndividual.errors) {
            alert(res.data?.subscribeBookFromIndividual.errors);
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
