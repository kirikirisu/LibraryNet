// webバーションでは、ユーザーが自分の持っている本を探して、同じ本を見つける必要がある。
// ユーザーが入力したキーワードによって本を検索するため、頻繁にAPIを叩く可能性がある。
// そのため、SWRでクライアントサイドでデータを取得する。
import useSWR from 'swr'
import axios from 'axios'
import React from 'react'
import {
  Flex,
  Box,
  Image,
  Button,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FALLBACK_IMG } from '../constants'

interface SearchResultProps {
  keyword: string
}

const fetcher = (url: string) => axios.get(url).then(res => res.data)

const SR: React.FC<SearchResultProps> = ({ keyword }) => {
  const url = `https://www.googleapis.com/books/v1/volumes?q=${keyword}&startIndex=0&maxResults=9`
  const { data, error } = useSWR(url, fetcher)

  const router = useRouter()

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  return (
    <Flex
      flexWrap="wrap"
      flexDir={{ base: 'column', md: 'row' }}
      mx="auto"
      maxW={{ base: '100%', md: "3xl" }}
      mt="10"
    >
      {data.items.map(({ id, volumeInfo }) => {
        const { imageLinks } = volumeInfo;
        return (
          <Box
            key={id}
            m="1"
            width={{ base: '100%', md: '32%' }}
            p="2"
            borderRadius="lg"
            borderWidth="thin"
            borderColor="gray.200"
            cursor="pointer"
            onClick={() => { router.push(`/publishBook/${id}`) }}
          >
            <Image
              borderRadius="lg"
              w="100%"
              objectFit="cover"
              src={imageLinks ? imageLinks.smallThumbnail : FALLBACK_IMG}
              alt="book image"
            />
          </Box>
        )
      })}
    </Flex>
  );
}

export const SearchResult = React.memo(SR);
