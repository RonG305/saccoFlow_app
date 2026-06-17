import { BASE_URLS } from "@/api/base";
import { makeApiRequest } from "@/api/main";
import type { RegisterUserData } from "@/types/auth";

export const registerUser = async (userData: RegisterUserData) => {
  console.log("Registering user with data: ", userData);
  const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/register/`, {
    method: "POST",
    body: userData,
  });

  const data = await response?.json();
  console.log("Register user: ", data);

  if (!response?.ok) {
    const errorData = data || {};
    return {
      error:
        errorData?.message ||
        errorData?.error ||
        "Failed to create user account",
    };
  }
  return data;
};

export const loginUser = async (
  email: string,
  password: string,
  organizationId?: string,
) => {
  const body: Record<string, string> = { email, password };
  if (organizationId) body.organization_id = organizationId;

  const response = await makeApiRequest(BASE_URLS.AUTH_URL, `/login/`, {
    method: "POST",
    body,
  });

  const data = await response?.json();
  console.log("Login Response Data: ", data);

  if (!response?.ok) {
    const errorData = data || {};
    return {
      error: errorData?.message || errorData?.error || "Failed to login",
    };
  }

  const pre_auth_token = data?.data?.pre_auth_token ?? data?.pre_auth_token;
  document.cookie = `pre_auth_token=${pre_auth_token}; path=/; SameSite=Lax`;
  return { ...data, pre_auth_token };
};

export const verifyLoginOtp = async (pre_auth_token: string, otp: string) => {
  const body: Record<string, string> = { pre_auth_token, otp };
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    `/login/verify-otp`,
    {
      method: "POST",
      body,
    },
  );

  const data = await response?.json();
  console.log("Login Response Data: ", data);

  if (!response?.ok) {
    const errorData = data || {};
    return {
      error: errorData?.message || errorData?.error || "Failed to login",
    };
  }

  const accessToken = data?.data?.accessToken ?? data?.accessToken;
  document.cookie = `access_token=${accessToken}; path=/; SameSite=Lax`;
  return { ...data, accessToken };
};

export const updateUser = async (
  id: string,
  userData: Partial<RegisterUserData>,
) => {
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    `/users/${id}/update/`,
    {
      method: "PATCH",
      withToken: true,
      body: userData,
    },
  );
  const data = await response?.json();
  if (!response?.ok) {
    return { error: data?.message || data?.error || "Failed to update user" };
  }
  return data;
};

export const activateUser = async (id: string) => {
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    `/users/${id}/activate/`,
    {
      method: "PATCH",
      withToken: true,
    },
  );
  if (!response?.ok) {
    const data = await response?.json().catch(() => null);
    return { error: data?.message || data?.error || "Failed to activate user" };
  }
  return { success: true };
};

export const deactivateUser = async (id: string) => {
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    `/users/${id}/deactivate/`,
    {
      method: "PATCH",
      withToken: true,
    },
  );
  if (!response?.ok) {
    const data = await response?.json().catch(() => null);
    return {
      error: data?.message || data?.error || "Failed to deactivate user",
    };
  }
  return { success: true };
};

export const deleteUser = async (id: string) => {
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    `/users/${id}/delete/`,
    {
      method: "DELETE",
      withToken: true,
    },
  );
  if (!response?.ok) {
    const data = await response?.json().catch(() => null);
    return { error: data?.message || data?.error || "Failed to delete user" };
  }
  return { success: true };
};

export const requestPasswordChange = async (email: string) => {
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    "/change-password/request",
    { method: "POST", withToken: true, body: { email } },
  );
  const data = await response?.json().catch(() => null);
  if (!response?.ok) {
    return { error: data?.message || data?.error || "Failed to send OTP" };
  }
  return data;
};

export const confirmPasswordChange = async (
  email: string,
  otp: string,
  new_password: string,
  confirm_password: string,
) => {
  const response = await makeApiRequest(
    BASE_URLS.AUTH_URL,
    "/change-password/confirm",
    {
      method: "POST",
      withToken: true,
      body: { email, otp, new_password, confirm_password },
    },
  );
  const data = await response?.json().catch(() => null);
  if (!response?.ok) {
    return { error: data?.message || data?.error || "Failed to change password" };
  }
  return data;
};

export const logoutUser = () => {
  const expired = `expires=${new Date(0).toUTCString()}; path=/;`;
  document.cookie = `access_token=; ${expired}`;
  document.cookie = `token=; ${expired}`;
  document.cookie = `refreshToken=; ${expired}`;
  document.cookie = `userId=; ${expired}`;
};
