import { Book, useReturnBookMutation } from '../generated/graphql';
import { Text, Button, Image, Box } from '@chakra-ui/react';
import { omitString } from '../utils/omitString';
import { useRouter } from 'next/router';
import { HandyBook } from '../types';

interface BookCardProps {
  book: HandyBook;
  buttonVariant?: 'returnBook' | 'subscribeBook';
}

export const BookCard: React.FC<BookCardProps> = ({ book, buttonVariant }) => {
  const router = useRouter();
  const [returnBook] = useReturnBookMutation();
  return (
    <Box
      key={book.id}
      p={2}
      mb={4}
      display="flex"
      borderRadius="sm"
      borderWidth="thin"
      borderColor="gray.200"
      position="relative"
    >
      <Box flexShrink={0}>
        <Image
          width={{ md: 48 }}
          objectFit="cover"
          borderRadius="lg"
          src={book.img}
          alt="Book image"
        />
      </Box>
      <Box mt={{ base: 2, md: 0 }} ml={{ base: 4, md: 6 }}>
        <Text
          mt={1}
          display="block"
          fontSize="xl"
          lineHeight="normal"
          fontWeight="semibold"
        >
          {book.title}
        </Text>
        <Text
          display={{ base: 'none', md: 'block' }}
          mt={2}
          color="gray.500"
          fontSize="md"
        >
          {omitString(book.description)}
        </Text>
        {buttonVariant === 'returnBook' ? (
          <Button
            position="absolute"
            right="4"
            bottom="4"
            variant="outline"
            colorScheme="teal"
            onClick={async () => {
              try {
                const res = await returnBook({
                  variables: { id: book.id },
                });
                if (!res.data?.returnBook) {
                  alert('return book faild');
                } else {
                  router.push('/');
                }
              } catch (err) {
                alert(err);
              }
            }}
          >
            本を返す
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};