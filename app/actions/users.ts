"use server"; // ⬅ WAJIB DI PALING ATAS FILE

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// GET USERS
export async function getUsers() {
  return await prisma.user.findMany({
    include: { posts: true },
  });
}

// CREATE USER
export async function createUser(formData: FormData) {
  await prisma.user.create({
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      posts: {
        create: {
          title: formData.get("title") as string,
          content: formData.get("content") as string,
          published: true,
        },
      },
    },
  });

  revalidatePath("/");
}

// UPDATE USER
export async function updateUser(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.user.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
    },
  });

  revalidatePath("/");
}

// DELETE USER
export async function deleteUser(formData: FormData) {
  const id = Number(formData.get("id"));

  await prisma.post.deleteMany({
    where: { authorId: id },
  });

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/");
}
