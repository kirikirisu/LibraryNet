import React, { useEffect } from 'react'
import { Box, Button, Input } from "@chakra-ui/react"
import { Formik, Form } from 'formik'
import router from 'next/router'
import { InputField } from '../components/InputField'
import { toErrorMap } from '../utils/toErrorMap'

interface publishBookProps {

}

const PublishBook: React.FC<{}> = ({ }) => {
  const [searchValue, setSearchValue] = React.useState("")
  const handleChange = (event: any) => setSearchValue(event.target.value)

  const searchBook = async (keyword) => {

  }

  useEffect(() => {

  })

  return (
    <Box maxW="xl" mx="auto">
      <Input
        value={searchValue}
        onChange={handleChange}
        placeholder="Search Book"
        focusBorderColor="teal.500"
      />
      <Button
        mt={4}
        colorScheme="teal"
        isLoading={false}
        type="submit"
      >
        search
      </Button>
    </Box>
  );
}

export default PublishBook;
