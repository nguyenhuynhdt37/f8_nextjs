import { Breadcrumbs } from '@/components/admin/MainContent/Breadcrumbs';
import EmployeeCreate from '@/components/admin/MainContent/EmployeeListingPage/EmployeeCreate';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Employee', link: '/dashboard/employee' },
  { title: 'Create', link: '/dashboard/employee/create' },
];

export default function EmployeeViewPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <EmployeeCreate />
    </div>
  );
}
