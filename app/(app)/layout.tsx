import { redirect } from "next/navigation";

import { AppShell } from "@/components/layout/app-shell";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const unreadCount = notifications.filter((item) => item.readAt === null).length;

  return (
    <AppShell
      user={{
        id: session.user.id,
        name: session.user.name ?? "Fitnity User",
        email: session.user.email ?? "",
        image: session.user.image,
        level: session.user.level,
        xp: session.user.xp,
      }}
      notifications={notifications}
      unreadCount={unreadCount}
    >
      {children}
    </AppShell>
  );
}
