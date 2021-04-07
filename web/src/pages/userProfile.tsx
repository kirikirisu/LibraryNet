import withApollo from '../utils/withApollo';
import {
  useMyPublishBooksQuery,
  useMySubscribeBooksQuery,
} from '../generated/graphql';
import { Header } from '../components/Header';
import {
  Link,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { omitString } from '../utils/omitString';

const UserProfile: React.FC = () => {
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

  if (subError || pubError) return <p>Error :(</p>;
  if (subLoading || pubLoading) return <p>Loading...</p>;
  if (!subData || !pubData) return <p>can not get data</p>;

  return (
    <Box>
      <Header />
      <Box
        overflow="scroll"
        maxW={{ base: '90vw', md: '4xl' }}
        min={{ base: '80vh', md: '2xl' }}
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
                  // display="flex"
                  borderRadius="sm"
                  borderWidth="thin"
                  borderColor="gray.200"
                >
                  <Box display="flex">
                    <Box flexShrink={0}>
                      <Image
                        width={{ md: 48 }}
                        // height={{ base: '50%', md: '100%' }}
                        objectFit="cover"
                        borderRadius="lg"
                        src={book.img}
                        alt="Library image"
                      />
                    </Box>
                    <Text
                      mt={1}
                      display="block"
                      fontSize="xl"
                      lineHeight="normal"
                      fontWeight="semibold"
                    >
                      {book.title}
                    </Text>
                  </Box>
                  <Text mt={2} color="gray.500" fontSize="md">
                    {omitString(book.description)}
                  </Text>
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
