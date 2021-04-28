import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Flex, Box, Image, Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FALLBACK_IMG } from '../constants';

interface SearchResultProps {
  keyword: string;
}

// const fetcher = (url: string) => axios.get(url).then((res) => res.data);
const getBooks = async (keyword, startIndex) => {
  console.log(keyword, startIndex);
  let offset;
  if (startIndex === 0) {
    offset = 0;
  } else {
    offset = startIndex * 9 + 1;
  }
  console.log('offset', offset);

  const { data } = await axios({
    method: 'get',
    url: `https://www.googleapis.com/books/v1/volumes?q=${keyword}&startIndex=${offset}&maxResults=9`,
  });
  return { items: data.items };
};

const SR: React.FC<SearchResultProps> = ({ keyword }) => {
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const [allBooks, setAllBooks] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>();

  const fetchData = async () => {
    setLoading(true);
    const { items } = await getBooks(keyword, startIndex);
    setLoading(false);
    console.log('startIndex', startIndex);

    if (startIndex === 0) {
      setAllBooks([...items]);
      return;
    }
    setAllBooks([...allBooks, ...items]);
  };

  const refreshData = () => {
    // setStartIndexによって一つ目のuseEffectが動くはず
    setStartIndex(0);
    setAllBooks([]);
    // しかし初回にkeywordが変わってもfetchDataされないため
    // ここにもfetchDataを置いとく
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [startIndex]);

  useEffect(() => {
    refreshData();

    // 確実にallBooksを破棄する
    return () => {
      setAllBooks([]);
    };
  }, [keyword]);

  console.log('allBooks', allBooks);

  // if (error) return <div>failed to load</div>;
  if (allBooks.length === 0) return <div>loading...</div>;

  return (
    <>
      <Flex
        flexWrap="wrap"
        flexDir={{ base: 'column', md: 'row' }}
        mx="auto"
        maxW={{ base: '100%', md: '3xl' }}
        my="10"
      >
        {allBooks.map(({ id, volumeInfo }, i) => {
          const { imageLinks } = volumeInfo;
          return (
            <Box
              key={id + i}
              m="1"
              width={{ base: '100%', md: '32%' }}
              p="2"
              borderRadius="lg"
              borderWidth="thin"
              borderColor="gray.200"
              cursor="pointer"
              onClick={() => {
                router.push(`/publishBook/${id}`);
              }}
            >
              <Image
                borderRadius="lg"
                w="100%"
                objectFit="cover"
                src={imageLinks ? imageLinks.smallThumbnail : FALLBACK_IMG}
                alt="book image"
              />
            </Box>
          );
        })}
        <Button
          mt="4"
          mx="auto"
          variant="outline"
          colorScheme="teal"
          isLoading={loading}
          onClick={() => {
            setStartIndex(startIndex + 1);
          }}
        >
          more
        </Button>
      </Flex>
    </>
  );
};

export const SearchResult = React.memo(SR);
