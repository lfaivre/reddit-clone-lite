import { ChakraProvider } from '@chakra-ui/core';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: `http://localhost:4000/graphql`,
  fetchOptions: {
    credentials: `include`,
  },
});

// @todo Fix Prop Types
function MyApp({ Component, pageProps }: any) {
  return (
    <Provider value={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
