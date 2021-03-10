import { Box, Image, Text, Link } from "@chakra-ui/react"
import { useLibrarysQuery } from '../generated/graphql';
import withApollo from '../utils/withApollo'

import { Header } from '../components/Header'
import MainContainerWidth from "../components/MainContainerWidth";

const Index: any = ({ }) => {
  const { data, loading, error } = useLibrarysQuery()

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>couldn't get data</p>

  return (
    <Box>
      <Header />
      <MainContainerWidth>
        {
          data.librarys?.map((lib) => (
            <Box bg="teal.50" p={2} display={{ md: "flex" }}>
              <Box flexShrink={0}>
                <Image
                  borderRadius="lg"
                  width={{ md: 40 }}
                  src="https://bit.ly/2jYM25F"
                  alt="Woman paying for a purchase"
                />
              </Box>
              <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
                <Text
                  fontWeight="bold"
                  textTransform="uppercase"
                  fontSize="sm"
                  letterSpacing="wide"
                  color="teal.600"
                >
                  Marketing
              </Text>
                <Link
                  mt={1}
                  display="block"
                  fontSize="lg"
                  lineHeight="normal"
                  fontWeight="semibold"
                  href="#"
                >
                  Finding customers for your new business
              </Link>
                <Text mt={2} color="gray.500">
                  Getting a new business off the ground is a lot of hard work. Here are five
                  ideas you can use to find your first customers.
              </Text>
              </Box>
            </Box>
          ))
        }
      </MainContainerWidth>
    </Box>
  )

}

export default withApollo({ ssr: true })(Index);
