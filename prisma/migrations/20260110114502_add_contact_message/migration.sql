-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "honeypot" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);
