import { getAllUser } from '@/api/api';
import EmployeeListingPage from '@/components/admin/MainContent/EmployeeListingPage';
import React from 'react';

const UsersPage = async () => {
  return <EmployeeListingPage />;
};

export default UsersPage;
