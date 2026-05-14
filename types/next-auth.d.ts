import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      username: string;
      onboardingCompleted: boolean;
      level: number;
      xp: number;
    };
  }

  interface User extends DefaultUser {
    username?: string;
    onboardingCompleted?: boolean;
    level?: number;
    xp?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    username?: string;
    onboardingCompleted?: boolean;
    level?: number;
    xp?: number;
  }
}
