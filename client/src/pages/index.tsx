import { Box } from '@chakra-ui/core';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import { NavBar } from '../components/NavBar';
import { usePostsQuery } from '../generated/graphql';
import { createUrqlClient } from '../utils/createUrqlClient';

type IndexProps = {};

const Index: React.FC<IndexProps> = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <NavBar />
      <Box>
        {data ? (
          data.posts.map((post) => <div key={post.id}>{post.title}</div>)
        ) : (
          <div>Loading...</div>
        )}
      </Box>
    </>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
