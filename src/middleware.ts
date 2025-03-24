import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/register/:path*",
    "/assembly/:path*",
    "/api/assemblies/:path*",
    "/api/registrations/:path*",
  ],
}; 