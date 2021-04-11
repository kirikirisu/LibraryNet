import withApollo from '../utils/withApollo';
import {
  useMyPublishBooksQuery,
  useMySubscribeBooksQuery,
} from '../generated/graphql';
import { Header } from '../components/Header';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BookCard } from '../components/BookCard';

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
                <BookCard
                  key={book.id}
                  book={book}
                  buttonVariant="returnBook"
                />
              ))}
            </TabPanel>
            <TabPanel>
              {pubData.myPublishBooks?.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default withApollo({ ssr: false })(UserProfile);
