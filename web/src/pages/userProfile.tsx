import { useState, useEffect } from 'react';
import withApollo from '../utils/withApollo';
import {
  useMyPublishBooksQuery,
  useMySubscribeBooksQuery,
} from '../generated/graphql';
import { Header } from '../components/Header';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
} from '@chakra-ui/react';
import { BookCard } from '../components/BookCard';
import { BookAvailable, RegularBook } from '../types';

const refleshSort = (
  allPublishBooks: RegularBook[],
  currentSortType: BookAvailable
) => {
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
    BookAvailable | string
  >('all');

  // 一番最初に走るuseEffectの時はpubDataはロードされていない
  // そのためpubDataがロード完了した時点でsetPublishBooksする
  // pubDataは画面ロード時一度しか変化しない
  useEffect(() => {
    if (pubData?.myPublishBooks) {
      const pb = pubData.myPublishBooks;
      setPublishBooks(pb);
      console.log('initial set success', pb);
      return;
    }
    console.log('skip initial set');
  }, [pubData]);

  // 選択されたソートタイプによりソートする
  useEffect(() => {
    if (pubData?.myPublishBooks) {
      const sorted = refleshSort(pubData.myPublishBooks, currentSortType);
      setPublishBooks(sorted);
      return;
    }
  }, [currentSortType]);

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
              <Box w="xs" mb="4">
                <Select
                  variant="filled"
                  onChange={(e) => {
                    setCurrentSortType(e.target.value);
                  }}
                >
                  <option value="all">全て</option>
                  <option value="valid">公開中</option>
                  <option value="invalid">貸し出し中</option>
                </Select>
              </Box>
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
