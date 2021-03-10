import {
  Flex,
  Button,
  Box,
  Heading,
  Text,
  Link,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem
} from '@chakra-ui/react'
import { HamburgerIcon, AddIcon, ArrowForwardIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import NextLink from 'next/link'

interface HeaderProps {

}

export const Header: React.FC<HeaderProps> = ({ }) => {
  const { data, loading } = useMeQuery({ skip: typeof window === "undefined" })
  const [logout, { loading: logoutLoading }] = useLogoutMutation()

  let body = null;
  if (loading) {
    body = <Text>Loading...</Text>
  } else if (!data?.me) {
    body = (
      <>
        <Box display={{ base: "none", lg: "block" }}>
          <Flex justify="center" align="center">
            <NextLink href="/login">
              <Button
                variant="outline"
                colorScheme="teal"
                mr="2"
                as={Link}
              >
                login
              </Button>
            </NextLink>
            <NextLink href="/register">
              <Button
                variant="solid"
                colorScheme="teal"
                as={Link}
              >
                register
              </Button>
            </NextLink>
          </Flex>
        </Box>
        <Box display={{ base: "block", lg: "none" }}>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon />}
              size="md"
              variant="outline"
            />
            <MenuList>
              <NextLink href="/login">
                <MenuItem icon={<ArrowForwardIcon />}>
                  Login
                </MenuItem>
              </NextLink>
              <NextLink href="/register">
                <MenuItem icon={<AddIcon />}>
                  Register
                </MenuItem>
              </NextLink>
            </MenuList>
          </Menu>
        </Box>
      </>
    )
  } else {
    body = (
      <>
        <Box display={{ base: "none", lg: "block" }}>
          <Flex justify="center" align="center">
            <Text fontSize="xl" mr="4">{data.me.username}</Text>
            <Button
              variant="outline"
              colorScheme="teal"
              isLoading={logoutLoading}
              onClick={async () => {
                await logout();
              }}
            >
              logout
        </Button>
          </Flex>
        </Box>
        <Box display={{ base: "block", lg: "none" }}>
          <Flex justify="center" align="center">
            <Text fontSize="xl" mr="4">{data.me.username}</Text>
            <IconButton
              aria-label="logout button"
              size="sm"
              icon={<ExternalLinkIcon />}
              isLoading={logoutLoading}
              onClick={async () => {
                await logout();
              }}
            />
          </Flex>
        </Box>
      </>
    )
  }

  return (
    <Box
      position="sticky"
      top="0"
      w="full"
      py="4"
      px={{ base: 2, md: 4 }}
      mb="4"
      borderTopWidth="thick"
      borderTopColor="teal.500"
      borderBottomWidth="thin"
      borderBottomStyle="ridge"
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        maxW="4xl"
        mx="auto"
        px={{ base: 2, sm: 4, md: 0 }}
      >
        <Heading size="lg">Library Net</Heading>
        <Box>{body}</Box>
      </Flex>
    </Box>
  );
}
