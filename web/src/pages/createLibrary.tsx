import { Box, Button } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import { InputField } from '../components/InputField';
import { useCreateLibraryMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
// import { useRouter } from 'next/router';
import withApollo from '../utils/withApollo';

const CreateLibrary: React.FC = () => {
  // const router = useRouter();
  const [createLibrary] = useCreateLibraryMutation();

  return (
    <Box maxW="xl" mx="auto">
      <Formik
        initialValues={{ title: '', description: '', icon: '' }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const res = await createLibrary({
              variables: { input: { ...values } },
            });

            if (res.data?.createLibrary.errors) {
              setErrors(toErrorMap(res.data.createLibrary.errors));
            } else if (res.data?.createLibrary.library) {
              alert('sucsess');
            }
          } catch (err) {
            alert(err);
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box my="5">
              <InputField
                name="description"
                placeholder="description"
                label="Description"
              />
            </Box>
            <Box my="5">
              <InputField name="icon" placeholder="icon" label="Icon" />
            </Box>
            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
            >
              create library
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default withApollo({ ssr: false })(CreateLibrary);
