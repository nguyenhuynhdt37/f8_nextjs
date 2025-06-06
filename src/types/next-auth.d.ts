import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

interface IUser {
  _id: string;
  username: string;
  email: string;
  isVerify: boolean;
  type: string;
  role: string;
}

interface IAuthSlice {
  emailSentEmail: string;
  user: any | null;
  loading: boolean;
  error: string | null;
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    access_token: string;
    refresh_token: string;
    user: IUser;
    access_expire: number;
    error: string;
  }
}

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser;
    access_token: string;
    refresh_token: string;
    access_expire: number;
    error: string;
  }
}
interface ICheckCode {
  email: string;
  codeID: string;
}
interface LoginParams {
  email: string;
  password: string;
}
interface IAuthSlice {
  user: any;
  loading: boolean;
  error: any;
  accessToken: string;
}
interface ICreateUser {
  fullName: string;
  email: string;
  password: string;
  isActive: number;
}

interface IUser {
  id: string;
  fullName: string;
  email: string;
  isActive: number;
  avatar: string;
}

interface IPageListProps<T> {
  data: T[] | undefined;
}

interface IUpdateUser {
  fullName: string;
  password: string;
  githubLink: string;
  facebookLink: string;
  youtubeLink: string;
  userName: string;
  personalWebsite: string;
}

interface IpageEdit {
  pageSize: number;
  pageNumber: number;
  totalPage: number;
  totalCount: number;
  searchTerm: string;
  sortField: string;
  sortOrder: string;
  status?: string;
  role?: string;
}
interface IGetWithParam {
  config: IpageEdit;
}
