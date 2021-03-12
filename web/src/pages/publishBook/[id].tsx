// このページでは、SSRをする。
// apolloのqueryによるフェッチをサーバサイドで実行するわけではなく、
// google books apiをサーバサイドで実行する。
// そのため、普通にgetServerSidePropsを使う。
import { GetServerSideProps } from 'next'
import { Button, Link, Flex, Box, Img, Image, Heading, Text } from '@chakra-ui/react'
import { FALLBACK_IMG, FALLBACK_TXT } from '../../constants';

const BOOKS_API_BASE_URL = "https://www.googleapis.com/books/v1/volumes/";

const deleteTags = (t: string) => {
  const replaced = t.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
  return replaced
}

const omitString = (t: string) => {
  const max = 300;

  if (t.length > max) {
    return t.substr(0, max) + '...'
  }

  return t
}

const spaceTol = (t: string) => {
  // 半角か全角のスペース
  const rp = t.replace(/ |　/g, '｜')
  return rp
}

const PublishBook = ({ book }: any) => {
  const { title, imageLinks, description, infoLink } = book.volumeInfo
  // console.log("book", book.volumeInfo)
  const tit = spaceTol(title)
  const desc = deleteTags(description)
  const imgLin = imageLinks ? imageLinks.smallThumbnail : FALLBACK_IMG

  const publish = () => {
    const sendObj = {
      title: tit,
      description: desc,
      img: imgLin,
      inforLink: infoLink,
      available: true,
    }
    console.log("sendObj", sendObj)
  }

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
        <Img
          w="30%"
          objectFit="cover"
          src={imgLin}
          alt="book image"
        />
        <Box ml="4" w="70%">
          <Flex direction="column">
            <Heading size="lg" isTruncated>{tit}</Heading>
            <Text mt={2} color="gray.500">{description ? omitString(desc) : FALLBACK_TXT}</Text>
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
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { id } = ctx.query
  const res = await fetch(BOOKS_API_BASE_URL + id)
  const book = await res.json()

  return {
    props: {
      book,
    }
  }
}

export default PublishBook;
