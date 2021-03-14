import React, { useEffect } from 'react'
import { Flex, Box, Button, Input } from '@chakra-ui/react'
import router from 'next/router'
import { SearchResult } from '../components/SearchResult'

const SearchBook: React.FC<{}> = ({}) => {
  const [searchValue, setSearchValue] = React.useState('')
  const handleChange = (event: any) => setSearchValue(event.target.value)

  const [keyword, setKeyword] = React.useState('技術書')
  const handlePush = () => setKeyword(searchValue)

  return (
    <>
      <Box maxW="xl" mx="auto" mt="16">
        <Flex align="center">
          <Input
            value={searchValue}
            onChange={handleChange}
            placeholder="Search Book"
            focusBorderColor="teal.500"
          />
          <Button
            ml={2}
            colorScheme="teal"
            isLoading={false}
            onClick={handlePush}
          >
            search
          </Button>
        </Flex>
      </Box>
      <SearchResult keyword={keyword} />
    </>
  )
}

export default SearchBook
