import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// MongoDB connection options сайжруулсан
const prismaClientOptions = {
  log: process.env.NODE_ENV === "development" 
    ? ["query", "error", "warn"] 
    : ["error"],
} as const;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(prismaClientOptions);

// Connection health check
prisma.$connect().catch((error) => {
  console.error("❌ MongoDB connection failed:", error);
});

// Graceful shutdown
if (typeof process !== "undefined") {
  process.on("beforeExit", async () => {
    await prisma.$disconnect();
  });
}

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}



