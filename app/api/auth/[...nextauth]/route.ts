import NextAuth from "next-auth";
import authOptions from "../../../lib/serverAuthOptions";

export const runtime = "nodejs";

const handler = NextAuth(authOptions as any);

export { handler as GET, handler as POST };