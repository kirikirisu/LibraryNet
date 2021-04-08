import withApollo from '../utils/withApollo';
import {
  useMyPublishBooksQuery,
  useMySubscribeBooksQuery,
  useReturnBookMutation,
} from '../generated/graphql';
import { Header } from '../components/Header';
import {
  Text,
  Button,
  Link,
  Image,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { omitString } from '../utils/omitString';
import { useRouter } from 'next/router';

const UserProfile: React.FC = () => {
  const router = useRouter();
  const {
    data: subData,
    loading: subLoading,
    error: subError,
  } = useMySubscribeBooksQuery();

  const {
    data: pubData,
    loading: pubLoading,
    error: pubError,
  } = useMyPublishBooksQuery();

  const [returnBook] = useReturnBookMutation();

  if (subError || pubError) return <p>Error :(</p>;
  if (subLoading || pubLoading) return <p>Loading...</p>;
  if (!subData || !pubData) return <p>can not get data</p>;

  return (
    <Box>
      <Header />
      <Box
        maxW={{ base: '90vw', md: '4xl' }}
        mx="auto"
        mt="30"
        py="2"
        px="2"
        borderRadius="lg"
        borderWidth="thin"
        borderColor="gray.200"
      >
        <Tabs isFitted variant="soft-rounded" colorScheme="teal">
          <TabList mb="1em">
            <Tab>借りている本</Tab>
            <Tab>公開している本</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              {subData.mySubscribeBooks?.map((book) => (
                <Box
                  key={book.id}
                  p={2}
                  mb={4}
                  display="flex"
                  borderRadius="sm"
                  borderWidth="thin"
                  borderColor="gray.200"
                  position="relative"
                >
                  <Box flexShrink={0}>
                    <Image
                      width={{ md: 48 }}
                      objectFit="cover"
                      borderRadius="lg"
                      src={book.img}
                      alt="Book image"
                    />
                  </Box>
                  <Box mt={{ base: 2, md: 0 }} ml={{ base: 4, md: 6 }}>
                    <Text
                      mt={1}
                      display="block"
                      fontSize="xl"
                      lineHeight="normal"
                      fontWeight="semibold"
                    >
                      {book.title}
                    </Text>
                    <Text
                      display={{ base: 'none', md: 'block' }}
                      mt={2}
                      color="gray.500"
                      fontSize="md"
                    >
                      {omitString(book.description)}
                    </Text>
                    <Button
                      position="absolute"
                      right="4"
                      bottom="4"
                      variant="outline"
                      colorScheme="teal"
                      onClick={async () => {
                        try {
                          const res = await returnBook({
                            variables: { id: book.id },
                          });
                          if (!res.data?.returnBook) {
                            alert('return book faild');
                          } else {
                            router.push('/');
                          }
                        } catch (err) {
                          alert(err);
                        }
                      }}
                    >
                      本を返す
                    </Button>
                  </Box>
                </Box>
              ))}
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default withApollo({ ssr: false })(UserProfile);
