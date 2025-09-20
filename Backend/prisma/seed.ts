import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seederFunction() {
  console.log("🌱 Seeding database with dummy users and sweets...");

  // Seed Users
  const users = [
    {
      email: "user@example.com",
      username: "user",
      password: await bcrypt.hash("userpassword123", 10),
      name: "John",
      role: "USER" as const,
      isActive: true,
    },
    {
      email: "admin@example.com",
      username: "admin",
      password: await bcrypt.hash("adminpassword123", 10),
      name: "Jane",
      role: "ADMIN" as const,
      isActive: true,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  // Seed Sweets
  const sweets = [
    {
      name: "Gulab Jamun",
      category: "Indian",
      price: 120.0,
      quantity: 50,
    },
    {
      name: "Rasgulla",
      category: "Indian",
      price: 150.0,
      quantity: 40,
    },
    {
      name: "Kaju Katli",
      category: "Indian",
      price: 250.0,
      quantity: 30,
    },
    {
      name: "Ladoo",
      category: "Indian",
      price: 100.0,
      quantity: 70,
    },
    {
      name: "Soan Papdi",
      category: "Indian",
      price: 180.0,
      quantity: 45,
    },
    {
      name: "Barfi",
      category: "Indian",
      price: 140.0,
      quantity: 60,
    },
    {
      name: "Jalebi",
      category: "Indian",
      price: 90.0,
      quantity: 80,
    },
    {
      name: "Peda",
      category: "Indian",
      price: 130.0,
      quantity: 55,
    },
    {
      name: "Sandesh",
      category: "Bengali",
      price: 160.0,
      quantity: 35,
    },
    {
      name: "Modak",
      category: "Indian",
      price: 200.0,
      quantity: 25,
    },
    {
      name: "Milk Cake",
      category: "Indian",
      price: 170.0,
      quantity: 40,
    },
    {
      name: "Cham Cham",
      category: "Bengali",
      price: 150.0,
      quantity: 38,
    },
    {
      name: "Kalakand",
      category: "Indian",
      price: 190.0,
      quantity: 42,
    },
    {
      name: "Besan Ladoo",
      category: "Indian",
      price: 110.0,
      quantity: 75,
    },
    {
      name: "Rasmalai",
      category: "Bengali",
      price: 220.0,
      quantity: 28,
    },
    {
      name: "Patisa",
      category: "Punjabi",
      price: 180.0,
      quantity: 33,
    },
    {
      name: "Chikki",
      category: "Indian",
      price: 90.0,
      quantity: 65,
    },
    {
      name: "Halwa",
      category: "Indian",
      price: 100.0,
      quantity: 70,
    },
    {
      name: "Imarti",
      category: "Indian",
      price: 95.0,
      quantity: 60,
    },
    {
      name: "Balushahi",
      category: "Indian",
      price: 120.0,
      quantity: 50,
    },
  ];

  for (const sweet of sweets) {
    await prisma.sweet.upsert({
      where: { name: sweet.name },
      update: {},
      create: {
        ...sweet,
        price: parseFloat(sweet.price.toString()),
      },
    });
  }

  console.log("✅ Seeding complete!");
}

seederFunction()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
