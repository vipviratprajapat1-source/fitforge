"use server";

import { hash } from "bcryptjs";
import crypto from "node:crypto";

import { prisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

function uniqueUsername(name: string, email: string) {
  return `${slugify(name) || email.split("@")[0]}${Math.floor(Math.random() * 900 + 100)}`;
}

export async function signUpAction(_: unknown, formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const goal = String(formData.get("goal") ?? "WELLNESS");

  if (name.length < 2) {
    return { ok: false, message: "Please enter your full name." };
  }

  if (!email.includes("@")) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, message: "That email is already in use." };
  }

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      username: uniqueUsername(name, email),
      passwordHash,
      fitnessGoal: goal as never,
      onboardingCompleted: false,
    },
  });

  await prisma.userSettings.create({
    data: {
      userId: user.id,
    },
  });

  await prisma.streak.create({
    data: {
      userId: user.id,
      current: 0,
      best: 0,
    },
  });

  return {
    ok: true,
    message: "Your account is ready. Log in to start onboarding.",
  };
}

export async function requestPasswordResetAction(_: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      ok: true,
      message: "If that account exists, a reset link is ready.",
    };
  }

  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return {
    ok: true,
    message: "Reset link created.",
    resetUrl: `/reset-password?token=${token}`,
  };
}

export async function resetPasswordAction(_: unknown, formData: FormData) {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");

  if (password.length < 8) {
    return { ok: false, message: "Password must be at least 8 characters." };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { ok: false, message: "This reset link has expired." };
  }

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: {
      passwordHash: await hash(password, 10),
    },
  });

  await prisma.passwordResetToken.update({
    where: { id: resetToken.id },
    data: { usedAt: new Date() },
  });

  return {
    ok: true,
    message: "Password updated. You can log in now.",
  };
}
