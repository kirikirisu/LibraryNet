import { Box, Flex, Center } from '@chakra-ui/react'

interface FormContainerProps {
  children: React.ReactNode
}

export const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <Flex
      height="100vh"
      widht="100vw"
      justify="center"
      align="center"
    >
      <Box
        width={{ base: "full", md: "container.sm" }}
        boxShadow="sm"
        mx={{ base: 4, md: 2 }}
        px={{ base: 4, md: 6 }}
        py="6"
        rounded="md"
        bg="white"
        border="1px"
        borderColor="gray.200"
      >
        {children}
      </Box>
    </Flex>
  );
}
