import { Box } from '@chakra-ui/core';
import React from 'react';

type WrapperProps = { variant?: `small` | `regular` };

export const Wrapper: React.FC<WrapperProps> = ({ children, variant }) => (
  <Box mt={8} mx="auto" w="100%" maxW={variant === `small` ? `400px` : `800px`}>
    {children}
  </Box>
);
