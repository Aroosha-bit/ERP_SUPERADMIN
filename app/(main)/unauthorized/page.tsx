import ErrorState from "@/components/common/error-state/ErrorState";

export default function UnauthorizedPage() {
  return (
    <ErrorState
      code="403"
      title="Access Denied"
      message="You do not have permission to access this page."
    />
  );
}
