import Link from "next/link";
import ErrorState from "@/components/common/error-state/ErrorState";

export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="Page Not Found"
      message="The page you are looking for does not exist or may have been moved."
    />
  );
}
