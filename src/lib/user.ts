import { decodeToken } from "./decode-token";

export interface UserData {
  sub: string;
  email: string;
  roles: string[];
  organization_id: string;
  iat: number;
  exp: number;
}

const getCookie = (name: string): string | null => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.split("=")[1] : null;
};

export const getUser = (): UserData | null => {
  const token = getCookie("access_token");
  if (!token) return null;
  return decodeToken<UserData>(token);
};

export const isTokenExpired = (user: UserData): boolean => {
  return Date.now() / 1000 > user.exp;
};

export const isDriver = (user: UserData): boolean => {
  return user.roles.includes("driver");
};
