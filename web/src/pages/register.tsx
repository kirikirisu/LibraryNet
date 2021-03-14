import { useRegisterMutation } from '../generated/graphql';
import { Form, Formik } from 'formik';
import { Button } from '@chakra-ui/button';
import { InputField } from '../components/InputField';
import { FormContainer } from '../components/FormContainer';
import { Box } from '@chakra-ui/layout';
import { toErrorMap } from '../utils/toErrorMap';
import withApollo from '../utils/withApollo';
import { useRouter } from 'next/router';

const Register: React.FC = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  return (
    <FormContainer>
      <Formik
        initialValues={{ username: '', email: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ variables: { options: values } });
          if (response.data?.register.errors) {
            setErrors(toErrorMap(response.data.register.errors));
          } else if (response.data?.register.user) {
            router.push('/');
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
            />
            <Box my="5">
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            <InputField
              name="password"
              placeholder="password"
              label="Password"
            />
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

export default withApollo({ ssr: false })(Register);
