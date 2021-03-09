import { Box } from '@chakra-ui/react'
import { Field, Form, Formik } from 'formik'
import { Button } from '@chakra-ui/button';
import { InputField } from "../components/InputField"
import { FormContainer } from '../components/FormContainer'
import { toErrorMap } from '../utils/toErrorMap'
import withApollo from '../utils/withApollo';
import { useRouter } from 'next/router'
import { useLoginMutation } from '../generated/graphql';


interface loginProps {

}

const Login: React.FC<loginProps> = ({ }) => {
  const router = useRouter()
  const [login] = useLoginMutation()

  return (
    <FormContainer>
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ variables: { ...values } })
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors))
          } else if (response.data?.login.user) {
            router.push("/")
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
  )
}

export default withApollo({ ssr: false })(Login);
