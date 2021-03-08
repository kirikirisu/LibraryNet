import React from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { Field, Form, Formik } from 'formik'
import { Button } from '@chakra-ui/button';
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { Input } from '@chakra-ui/input';
import { InputField } from '../components/InputField';
import ResponsiveWrapper from '../components/ResponsiveWrapper';

interface registerProps {

}

const Register: React.FC<registerProps> = ({ }) => {
  function validateName(value) {
    let error
    if (!value) {
      error = "Name is required"
    } else if (value.toLowerCase() !== "naruto") {
      error = "Jeez! You're not a fan 😱"
    }
    return error
  }

  return (
    <ResponsiveWrapper>
      <Formik
        initialValues={{ username: "" }}
        onSubmit={(values, actions) => {
          console.log(values)
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="username"
              placeholder="username"
              label="Username"
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
    </ResponsiveWrapper>
  )
}

export default Register;
