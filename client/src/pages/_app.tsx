import { ChakraProvider } from '@chakra-ui/core';
import { createClient, Provider } from 'urql';

const client = createClient({
  url: `http://localhost:4000/graphql`,
  fetchOptions: {
    credentials: `include`,
  },
});

function MyApp({ Component, pageProps }) {
  return (
    <Provider value={client}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </Provider>
  );
}

export default MyApp;
