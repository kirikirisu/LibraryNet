import { Box } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { Button } from '@chakra-ui/button';
import { InputField } from '../components/InputField';
import { FormContainer } from '../components/FormContainer';
import { toErrorMap } from '../utils/toErrorMap';
import withApollo from '../utils/withApollo';
import { useRouter } from 'next/router';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';

const Login: React.FC = () => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <FormContainer>
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            variables: { ...values },
            // キャッシュを書き換える
            // loginで返ってきたdataをmeクエリのキャッシュに書き込む
            update: (cache, { data }) => {
              cache.writeQuery<MeQuery>({
                query: MeDocument,
                data: {
                  __typename: 'Query',
                  me: data?.login.user,
                },
              });

              // const hasLib = cache.readQuery()
            },
          });
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (response.data?.login.user) {
            if (typeof router.query.next === 'string') {
              router.push(router.query.next);
            } else {
              router.push('/');
            }
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or Email"
            />
            <Box my="5">
              <InputField
                name="password"
                placeholder="password"
                label="Password"
              />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default withApollo({ ssr: false })(Login);
