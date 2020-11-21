import { NextPage } from 'next';
import React from 'react';

type ChangePasswordProps = { token: string };

const ChangePassword: NextPage<ChangePasswordProps> = ({ token }) => {
  return (
    <>
      <div>{`Change Password - Token: ${token}`}</div>
    </>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: (query as ChangePasswordProps).token,
  };
};

export default ChangePassword;
