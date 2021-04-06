import withApollo from '../utils/withApollo';
import {
  useMyPublishBooksQuery,
  useMySubscribeBooksQuery,
} from '../generated/graphql';

const UserProfile: React.FC = () => {
  const {
    data: subData,
    loading: subLoading,
    error: subError,
  } = useMySubscribeBooksQuery();

  const {
    data: pubData,
    loading: pubLoading,
    error: pubError,
  } = useMyPublishBooksQuery();

  if (subError || pubError) return <p>Error :(</p>;
  if (subLoading || pubLoading) return <p>Loading...</p>;
  if (!subData || !pubData) return <p>can not get data</p>;

  return <div>hello world</div>;
};

export default withApollo({ ssr: false })(UserProfile);
