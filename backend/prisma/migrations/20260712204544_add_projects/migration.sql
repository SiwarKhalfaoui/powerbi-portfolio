-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('DASHBOARD', 'REPORT', 'ANALYSIS', 'TEMPLATE', 'CASE_STUDY');

-- CreateEnum
CREATE TYPE "ProjectLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PRIVATE', 'ARCHIVED');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "businessDomain" TEXT,
    "projectType" "ProjectType" NOT NULL DEFAULT 'DASHBOARD',
    "toolsUsed" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "level" "ProjectLevel" NOT NULL DEFAULT 'BEGINNER',
    "coverImageUrl" TEXT,
    "galleryImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interactiveLink" TEXT,
    "ownershipConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "datasetUrl" TEXT,
    "results" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "projects_slug_idx" ON "projects"("slug");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
