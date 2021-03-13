import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFieldProps> = ({ label, textarea, ...props }) => {
  const [field, { error }] = useField(props)

  let InputOrTextarea: any = Input;
  if (textarea) {
    InputOrTextarea = Textarea
  }

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{label}</FormLabel>
      <InputOrTextarea {...field} {...props} id={field.name} />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
