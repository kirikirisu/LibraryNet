import { Box, Img, Text, Link } from '@chakra-ui/react';
import { useLibrarysQuery } from '../generated/graphql';
import withApollo from '../utils/withApollo';
import NextLink from 'next/link';

import { Header } from '../components/Header';
import MainContainerWidth from '../components/MainContainerWidth';
import { CreateLibraryButton } from '../components/CreateLibraryButton';

const Index: any = () => {
  const { data, loading, error } = useLibrarysQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>can not get data</p>;

  return (
    <Box>
      <Header />
      <MainContainerWidth>
        <CreateLibraryButton />
        {data.librarys?.map((lib) => (
          <Box
            key={lib.id}
            p={2}
            mb={4}
            display={{ md: 'flex' }}
            borderRadius="sm"
            borderWidth="thin"
            borderColor="gray.200"
          >
            <Box flexShrink={0}>
              <Img
                width={{ md: 48 }}
                height={{ md: 48 }}
                objectFit="cover"
                borderRadius="lg"
                src={lib.icon}
                alt="Library image"
              />
            </Box>
            <Box mt={{ base: 4, md: 0 }} ml={{ md: 6 }}>
              <Text
                fontWeight="bold"
                textTransform="uppercase"
                fontSize="md"
                letterSpacing="wide"
                color="teal.600"
              >
                {lib.organization ? 'organization' : 'individual'}
              </Text>
              <NextLink href={`/shelf/${lib.adminId}`}>
                <Link
                  mt={1}
                  display="block"
                  fontSize="xl"
                  lineHeight="normal"
                  fontWeight="semibold"
                >
                  {lib.title}
                </Link>
              </NextLink>
              <Text mt={2} color="gray.500" fontSize="md">
                {lib.description}
              </Text>
            </Box>
          </Box>
        ))}
      </MainContainerWidth>
    </Box>
  );
};

export default withApollo({ ssr: true })(Index);
