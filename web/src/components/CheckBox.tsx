import { useCheckbox, Checkbox, FormControl } from '@chakra-ui/react';

interface ReCheckBoxProps {

}

export const ReCheckBox: React.FC<ReCheckBoxProps> = ({ }) => {
  const { state } = useCheckbox()
  console.log("check", state.isChecked)
  return (
    <FormControl>
      <Checkbox value="organization" size="lg" colorScheme="teal">
        Organization
      </Checkbox>
    </FormControl>

  );
}
