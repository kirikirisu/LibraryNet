import { Box } from '@chakra-ui/react';
import { useBooksQuery } from '../../generated/graphql'
import { useGetId } from '../../utils/useGetId';
import withApollo from '../../utils/withApollo'

const Shelf: React.FC<{}> = ({ }) => {
    const intId = useGetId()

    const { data, loading, error } = useBooksQuery({
        skip: intId === -1,
        variables: { id: intId }
    })

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    if (!data) return <p>couldn't get data</p>

    return (
        <>
            {data.books.map((book) => {
                return <Box key={book.id}>{book.title}</Box>
            })}
        </>
    );
}

export default withApollo({ ssr: true })(Shelf);
