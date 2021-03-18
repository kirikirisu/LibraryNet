import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useMeQuery } from '../generated/graphql';
import { isServer } from '../utils/isServer';

export const CreateLibraryButton: React.FC = () => {
  const { data, loading, error } = useMeQuery({ skip: isServer() });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>can not get data</p>;

  return (
    <>
      {data.me?.hasLibrary || data.me === null ? null : (
        <NextLink href="/createLibrary">
          <Button mb="4" colorScheme="teal">
            create library
          </Button>
        </NextLink>
      )}
    </>
  );
};
