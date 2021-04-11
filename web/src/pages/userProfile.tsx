import { useState, useEffect } from 'react';
import withApollo from '../utils/withApollo';
import {
  useMyPublishBooksQuery,
  useMySubscribeBooksQuery,
  MySubscribeBooksQueryHookResult,
  MySubscribeBooksQueryResult,
} from '../generated/graphql';
import { Header } from '../components/Header';
import { Box, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { BookCard } from '../components/BookCard';
import { HandyBook } from '../types';

const refleshSort = (allPublishBooks, currentSortType) => {
  console.log('all ', allPublishBooks);
  let sortedPublishBooks;

  switch (currentSortType) {
    case 'all':
      sortedPublishBooks = allPublishBooks;
      break;
    case 'valid':
      sortedPublishBooks = allPublishBooks?.filter(
        (book) => book.available === 'valid'
      );
      break;
    case 'invalid':
      sortedPublishBooks = allPublishBooks?.filter(
        (book) => book.available === 'invalid'
      );
      break;
    case 'asking':
      sortedPublishBooks = allPublishBooks?.filter(
        (book) => book.available === 'asking'
      );
      break;
    default:
      sortedPublishBooks = allPublishBooks;
  }

  console.log('retrun sorted', sortedPublishBooks);
  return sortedPublishBooks;
};

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

  const [publishBooks, setPublishBooks] = useState<any>([]);
  const [currentSortType, setCurrentSortType] = useState<
    'all' | 'valid' | 'asking' | 'invalid'
  >('all');

  useEffect(() => {
    if (pubData?.myPublishBooks) {
      // const pb = pubData.myPublishBooks;
      const sorted = refleshSort(pubData.myPublishBooks, currentSortType);
      setPublishBooks(sorted);
      console.log('set success', sorted);
      return;
    }
    console.log('skip set');
  }, [pubData, publishBooks, currentSortType]);

  // useEffect(() => {
  //   if (pubData?.myPublishBooks) {
  //     const sorted = refleshSort(pubData.myPublishBooks, currentSortType);
  //     setPublishBooks(sorted);
  //     return;
  //   }

  //   console.log('use effect');
  // }, [currentSortType]);

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
              {publishBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  buttonVariant="returnBook"
                />
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Box>
  );
};

export default withApollo({ ssr: false })(UserProfile);
