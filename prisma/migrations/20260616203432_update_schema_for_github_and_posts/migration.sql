-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "image_url" TEXT,
ALTER COLUMN "language" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "is_daily" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "post_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "github_username" TEXT;

-- CreateIndex
CREATE INDEX "Post_created_at_idx" ON "Post"("created_at");

-- CreateIndex
CREATE INDEX "Quiz_is_daily_created_at_idx" ON "Quiz"("is_daily", "created_at");
