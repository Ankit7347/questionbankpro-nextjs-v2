// app/not-found.tsx
import FriendlyError from "@/components/FriendlyError";

export const metadata = {
  title: "404 – Page Not Found",
};

export default function NotFound() {
  return (
    <FriendlyError
      title="Page Not Found"
      description="The page you are trying to access does not exist or has been moved."
    />
  );
}
