import { Flex, Box, Text, Img, Link, Button } from '@chakra-ui/react';
import {
  useBooksQuery,
  useSubscribeBookMutation,
} from '../../generated/graphql';
import { useGetId } from '../../utils/useGetId';
import withApollo from '../../utils/withApollo';
import MainContainerWidth from '../../components/MainContainerWidth';
import { omitString } from '../../utils/omitString';
import { useRouter } from 'next/router';

const h = (n: number): void => {
  console.log(n);
};

const Shelf: React.FC = () => {
  const intId = useGetId();
  const router = useRouter();

  const [subscribe] = useSubscribeBookMutation();

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
            <Flex direction="column" mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="md"
                letterSpacing="wide"
                color="teal.600"
              >
                {book.available ? 'available' : 'invalid'}
              </Text>
              <Link
                mt={1}
                display="block"
                fontSize="xl"
                lineHeight="normal"
                fontWeight="semibold"
              >
                {book.title}
              </Link>
              <Text mt={2} color="gray.500" fontSize="md">
                {omitString(book.description)}
              </Text>
              <Button
                alignSelf="flex-end"
                mt="6"
                mr="4"
                colorScheme="teal"
                variant="outline"
                onClick={async () => {
                  console.log(book.id);
                  const res = await subscribe({ variables: { id: book.id } });
                  if (res.data?.subscribeBook.errors) {
                    alert(res.data.subscribeBook.errors);
                  } else {
                    router.push('/');
                  }
                }}
              >
                subscribe book
              </Button>
            </Flex>
          </Box>
        ))}
      </MainContainerWidth>
    </Box>
  );
};

export default withApollo({ ssr: true })(Shelf);
