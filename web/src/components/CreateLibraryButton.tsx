import { useHasLibraryQuery } from '../generated/graphql';
import { Button } from '@chakra-ui/react';
import NextLink from 'next/link';

const isServer = () => typeof window === 'undefined';

export const CreateLibraryButton: React.FC = () => {
  const { data, loading, error } = useHasLibraryQuery({ skip: isServer() });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      {data?.hasLibrary || data?.hasLibrary === null ? null : (
        <NextLink href="/createLibrary">
          <Button mb="4" colorScheme="teal">
            create library
          </Button>
        </NextLink>
      )}
    </>
  );
};
