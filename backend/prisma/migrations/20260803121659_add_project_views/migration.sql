-- CreateTable
CREATE TABLE "project_views" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "visitorKey" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_views_projectId_visitorKey_viewedAt_idx" ON "project_views"("projectId", "visitorKey", "viewedAt");

-- AddForeignKey
ALTER TABLE "project_views" ADD CONSTRAINT "project_views_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
