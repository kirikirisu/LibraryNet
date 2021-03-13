import { FormLabel, Box, Button, Checkbox, FormControl } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import React from "react";
import { InputField } from '../components/InputField'
import { useCreateLibraryMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from 'next/router'
import withApollo from '../utils/withApollo'

interface createLibraryProps {

}


const CreateLibrary: React.FC<createLibraryProps> = ({ }) => {
  const router = useRouter()
  const [checked, setChecked] = React.useState<boolean>(false)
  const [createLibrary] = useCreateLibraryMutation()

  const toggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    // console.log(e.target.checked)
    setChecked(e.target.checked)
  }

  return (
    <Box maxW="xl" mx="auto">
      <Formik
        initialValues={{ title: "", description: "", icon: "" }}
        onSubmit={async (values, { setErrors }) => {
          try {
            const res = await createLibrary({
              variables: { input: { ...values, organization: checked } }
            })

            if (res.data?.createLibrary.errors) {
              setErrors(toErrorMap(res.data.createLibrary.errors))
            } else if (res.data?.createLibrary.library) {
              alert('sucsess')
            }
          } catch (err) {
            alert(err)
          }
        }}
      >
        {(props) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="Title"
            />
            <Box my="5">
              <InputField
                name="description"
                placeholder="description"
                label="Description"
              />
            </Box>
            <Box my="5">
              <InputField
                name="icon"
                placeholder="icon"
                label="Icon"
              />
            </Box>
            <Box my="5">
              <Checkbox
                isChecked={checked}
                onChange={(e) => toggleCheck(e)}
              >
                Organization
              </Checkbox>
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
}

export default withApollo({ ssr: false })(CreateLibrary);
