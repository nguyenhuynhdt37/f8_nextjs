import { Breadcrumbs } from '@/components/admin/MainContent/Breadcrumbs';
import EmployeeEdit from '@/components/admin/MainContent/EmployeeListingPage/EmployeeEdit';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Employee', link: '/dashboard/users' },
  { title: 'Create', link: '/dashboard/users/edit' },
];

export default function EditUserPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <EmployeeEdit />
    </div>
  );
}
