import { Box, Flex, Link } from '@chakra-ui/core';
import NextLink from 'next/link';
import React from 'react';

type NavBarProps = {};

export const NavBar: React.FC<NavBarProps> = () => {
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={`auto`}>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>Register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
};
