export type LoginPayload = {
  email: string;
  cnic: string;
  password: string;
};

export type LoginUser = {
  id: string;
  name: string;
  email: string;
  cnic: string;
  role: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  user: LoginUser;
};

export async function loginUser(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed.");
  }

  return data;
}