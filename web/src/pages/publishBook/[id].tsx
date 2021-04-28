// google books apiをサーバー側でフェッチして、apolloのフェッチをクライアント側で行うこともできそう
// 簡単にするためにどちらもクライアント側でフェッチする
// import { GetServerSideProps } from 'next'
import useSWR from 'swr';
import axios from 'axios';
import { Button, Link, Flex, Box, Img, Heading, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { FALLBACK_IMG, FALLBACK_TXT } from '../../constants';
import { BookInput, usePublishBookMutation } from '../../generated/graphql';
import withApollo from '../../utils/withApollo';
import { omitString } from '../../utils/omitString';
import { BookCard } from '../../components/BookCard';

const BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes/';

const deleteTags = (t: string) => {
  const replaced = t?.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
  return replaced;
};

const spaceTol = (t: string) => {
  // 半角か全角のスペース
  const rp = t.replace(/ |　/g, '｜');
  return rp;
};

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const PublishBook = () => {
  const router = useRouter();

  const { id } = router.query;
  const url = BOOKS_API_BASE_URL + id;
  // skip when id is undefined
  const { data, error } = useSWR(id === undefined ? null : url, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const { title, imageLinks, description, infoLink } = data.volumeInfo;
  const tit = spaceTol(title);
  const desc = description ? deleteTags(description) : FALLBACK_TXT;
  const imgLin = imageLinks ? imageLinks.smallThumbnail : FALLBACK_IMG;

  const book: BookInput = {
    title: tit,
    description: desc,
    img: imgLin,
    inforLink: infoLink,
    available: 'valid',
  };

  return (
    <Flex height="100vh" widht="100vw" justify="center" align="center">
      <Box width={{ base: 'full', md: '4xl' }}>
        <BookCard book={book} buttonVariant="publishBook" />
      </Box>
    </Flex>
  );
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const { id } = ctx.query
//   const res = await fetch(BOOKS_API_BASE_URL + id)
//   const book = await res.json()

//   return {
//     props: {
//       book,
//     }
//   }
// }

export default withApollo({ ssr: false })(PublishBook);
