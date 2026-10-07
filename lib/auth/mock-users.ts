import { MOCK_PERMISSIONS } from "@/lib/auth/auth-config";
import type { AuthUser } from "@/lib/auth/auth-types";

type MockUserRecord = AuthUser & {
  password: string;
};

export const MOCK_USERS: MockUserRecord[] = [
  {
    id: "user-001",
    name: "Aroosha Fatima",
    email: "arooshafatima1006@gmail.com",
    cnic: "0000987654321",
    password: "123456789",
    role: "SUPER_ADMIN",
    tenantId: null,
    permissions: [...MOCK_PERMISSIONS],
  },
];

export function findMockUserByCredentials(
  email: string,
  cnic: string,
  password: string
) {
  return MOCK_USERS.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.cnic === cnic &&
      user.password === password
  );
}

export function findMockUserById(id: string) {
  return MOCK_USERS.find((user) => user.id === id);
}

export function toAuthUser(user: MockUserRecord): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    cnic: user.cnic,
    role: user.role,
    tenantId: user.tenantId,
    permissions: user.permissions,
  };
}