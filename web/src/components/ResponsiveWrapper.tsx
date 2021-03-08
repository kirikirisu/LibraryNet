import { Box, Text } from '@chakra-ui/react'

interface ResponsiveWrapperProps {
  children: React.ReactNode
}

const ResponsiveWrapper: React.FC<ResponsiveWrapperProps> = ({ children }) => {
  return (
    <Box width={{ base: 'full', md: '4xl' }} mx="auto" backgroundColor={{ base: 'aqua', md: 'bisque' }}>
      {children}
    </Box>
  );
}

export default ResponsiveWrapper;
