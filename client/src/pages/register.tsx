import { Box, Button } from '@chakra-ui/core';
import { Form, Formik } from 'formik';
import React from 'react';
import { useMutation } from 'urql';
import { InputField } from '../components/InputField';
import { Wrapper } from '../components/Wrapper';

type RegisterProps = {};

const registerMutation = `
mutation Register($username: String!, $password: String!) {
  register(username: $username, password: $password) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
`;

const Register: React.FC<RegisterProps> = () => {
  const [, register] = useMutation(registerMutation);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: ``, password: `` }}
        onSubmit={(values) => {
          return register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" placeholder="username" label="Username" />
            <Box mt={4}>
              <InputField name="password" placeholder="password" label="Password" type="password" />
            </Box>
            <Button
              isLoading={isSubmitting}
              type="submit"
              mt={4}
              colorScheme="teal"
              variant="solid"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
