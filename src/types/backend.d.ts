export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface SignInResponse {
    error?: string;
    code?: string;
    status?: number;
    ok?: boolean;
    url?: string;
  }
  interface Ilogin {
    email: string;
    password: string;
  }
  interface ICheckCode {
    email: string;
    codeID: string;
  }
  interface MessageResponse {
    message: string;
  }

  interface IRequest {
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    headers?: any;
  }

  interface IBackendRes<I> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: I;
    access_token?: string;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
  interface ILogin {
    user: {
      email: string;
      _id: string;
    };
    access_token: string;
  }
}
