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

const BOOKS_API_BASE_URL = 'https://www.googleapis.com/books/v1/volumes/';

const deleteTags = (t: string) => {
  const replaced = t.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
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
  const [publishBook] = usePublishBookMutation();

  const { id } = router.query;
  const url = BOOKS_API_BASE_URL + id;
  // skip when id is undefined
  const { data, error } = useSWR(id === undefined ? null : url, fetcher);

  if (error) return <div>failed to load</div>;
  if (!data) return <div>loading...</div>;

  const { title, imageLinks, description, infoLink } = data.volumeInfo;
  const tit = spaceTol(title);
  const desc = deleteTags(description);
  const imgLin = imageLinks ? imageLinks.smallThumbnail : FALLBACK_IMG;

  const publish = async () => {
    const sendObj: BookInput = {
      title: tit,
      description: desc,
      img: imgLin,
      inforLink: infoLink,
      available: 'vaild',
    };

    try {
      const res = await publishBook({ variables: { input: { ...sendObj } } });
      if (res.data?.publishBook.errors) {
        alert(res.data.publishBook.errors);
      } else if (res.data?.publishBook.book) {
        router.push('/');
      }
    } catch (err) {
      // userがログインしていない場合、ここでエラーを拾う
      alert(err);
    }
  };

  return (
    <Box
      mt="10"
      maxW="4xl"
      mx="auto"
      py="4"
      px="2"
      borderWidth="thin"
      borderColor="gray.200"
    >
      <Flex>
        <Img w="30%" objectFit="cover" src={imgLin} alt="book image" />
        <Box ml="4" w="70%">
          <Flex direction="column">
            <Heading size="lg" isTruncated>
              {tit}
            </Heading>
            <Text mt={2} color="gray.500">
              {description ? omitString(desc) : FALLBACK_TXT}
            </Text>
            <Link
              mt={1}
              display="block"
              fontSize="lg"
              lineHeight="normal"
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
              color="teal.600"
              href={infoLink}
            >
              more info
            </Link>
            <Button
              alignSelf="flex-end"
              mt="6"
              mr="4"
              colorScheme="teal"
              variant="outline"
              onClick={publish}
            >
              publish
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Box>
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
