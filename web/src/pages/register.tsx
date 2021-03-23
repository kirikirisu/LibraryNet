import React from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { Form, Formik } from 'formik';
import { Button } from '@chakra-ui/button';
import { InputField } from '../components/InputField';
import { FormContainer } from '../components/FormContainer';
import { Box, Checkbox } from '@chakra-ui/react';
import { toErrorMap } from '../utils/toErrorMap';
import withApollo from '../utils/withApollo';
import { useRouter } from 'next/router';

const Register: React.FC = () => {
  const router = useRouter();
  const [register] = useRegisterMutation();

  const [checked, setChecked] = React.useState<boolean>(false);

  const toggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // console.log(e.target.checked)
    setChecked(e.target.checked);
  };

  return (
    <FormContainer>
      <Formik
        initialValues={{ username: '', email: '', slackId: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({
            variables: { options: { ...values, organization: checked } },
          });
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
            <Box mt="5">
              <InputField
                name="slackId"
                placeholder="slackId"
                label="SlackID"
              />
            </Box>
            <Box my="5">
              <Checkbox isChecked={checked} onChange={(e) => toggleCheck(e)}>
                Organization
              </Checkbox>
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

export default withApollo({ ssr: false })(Register);
