import { Box, Text, Img, Link } from '@chakra-ui/react';
import { useBooksQuery } from '../../generated/graphql';
import { useGetId } from '../../utils/useGetId';
import withApollo from '../../utils/withApollo';
import MainContainerWidth from '../../components/MainContainerWidth';
import NextLink from 'next/link';
import { omitString } from '../../utils/omitString';

const Shelf: React.FC = () => {
  const intId = useGetId();

  const { data, loading, error } = useBooksQuery({
    skip: intId === -1,
    variables: { id: intId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>can not get data</p>;

  return (
    <Box>
      <MainContainerWidth>
        {data.books?.map((book) => (
          <Box
            key={book.id}
            p={2}
            mb={4}
            display={{ md: 'flex' }}
            borderRadius="sm"
            borderWidth="thin"
            borderColor="gray.200"
          >
            <Box flexShrink={0}>
              <Img
                width={{ md: 48 }}
                height={{ md: 56 }}
                objectFit="cover"
                borderRadius="lg"
                src={book.img}
                alt="Library image"
              />
            </Box>
            <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="md"
                letterSpacing="wide"
                color="teal.600"
              >
                {book.available ? 'available' : 'invalid'}
              </Text>
              <NextLink href={`/subscribeBook/${book.id}`}>
                <Link
                  mt={1}
                  display="block"
                  fontSize="xl"
                  lineHeight="normal"
                  fontWeight="semibold"
                >
                  {book.title}
                </Link>
              </NextLink>
              <Text mt={2} color="gray.500" fontSize="md">
                {omitString(book.description)}
              </Text>
            </Box>
          </Box>
        ))}
      </MainContainerWidth>
    </Box>
  );
};

export default withApollo({ ssr: true })(Shelf);
