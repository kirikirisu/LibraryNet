import {
  BookInput,
  usePublishBookMutation,
  useReturnBookMutation,
} from '../generated/graphql';
import { Text, Button, Image, Box } from '@chakra-ui/react';
import { omitString } from '../utils/omitString';
import { useRouter } from 'next/router';
import { RegularBook } from '../types';

interface BookCardProps {
  book: RegularBook | BookInput;
  buttonVariant?: 'returnBook' | 'publishBook';
}

export const BookCard: React.FC<BookCardProps> = ({ book, buttonVariant }) => {
  const router = useRouter();
  const [returnBook] = useReturnBookMutation();
  const [publishBook] = usePublishBookMutation();

  return (
    <Box
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
                  update: (cache) => {
                    cache.modify({
                      fields: {
                        mySubscribeBooks(existingBookRefs = [], { readField }) {
                          console.log('existingBookRefs', existingBookRefs);
                          const deletedReturnBooks = existingBookRefs.filter(
                            (bookRef) => {
                              return book.id !== readField('id', bookRef);
                            }
                          );

                          return deletedReturnBooks;
                        },
                      },
                    });
                  },
                });
                if (!res.data?.returnBook) {
                  alert('return book faild');
                } else {
                  // router.push('/');
                }
              } catch (err) {
                alert(err);
              }
            }}
          >
            本を返す
          </Button>
        ) : buttonVariant === 'publishBook' ? (
          <Button
            position="absolute"
            right="4"
            bottom="4"
            variant="outline"
            colorScheme="teal"
            onClick={async () => {
              try {
                const res = await publishBook({
                  variables: { input: { ...book } },
                });
                if (res.data?.publishBook.errors) {
                  alert(res.data.publishBook.errors);
                } else if (res.data?.publishBook.book) {
                  router.push('/');
                }
              } catch (err) {
                // userがログインしていない場合、ここでエラーを拾う
                alert(err);
              }
            }}
          >
            本を公開
          </Button>
        ) : null}
      </Box>
    </Box>
  );
};
