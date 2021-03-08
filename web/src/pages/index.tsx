import { useLibrarysQuery } from '../generated/graphql';
import withApollo from '../utils/withApollo'

const Index: any = ({ }) => {
  const { data, loading, error } = useLibrarysQuery()

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  if (!data) return <p>couldn't get data</p>

  return data.librarys?.map(({ id, description }) => (
    <div key={id}>
      <p>
        {description}
      </p>
    </div>
  ));
}

export default withApollo({ ssr: true })(Index);
