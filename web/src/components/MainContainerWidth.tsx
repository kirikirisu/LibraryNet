import { Box, Text } from '@chakra-ui/react'

interface ResponsiveWrapperProps {
  children: React.ReactNode
}

const MainContainerWidth: React.FC<ResponsiveWrapperProps> = ({ children }) => {
  return (
    <Box
      maxW="4xl"
      mx="auto"
      py="4"
      px="2"
    >
      {children}
    </Box>
  );
}

export default MainContainerWidth;
