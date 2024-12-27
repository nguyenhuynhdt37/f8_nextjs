import { cookies } from 'next/headers';

export const useCookie = (): any => {
  const cookieStore = cookies();
  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');
};
