-- AlterTable
ALTER TABLE "User" ADD COLUMN "streak_days" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "last_active_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "is_pinned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN "scheduled_for" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "post_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizLibrary" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correct_index" INTEGER NOT NULL,
    "tags" TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizLibrary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_scheduled_for_key" ON "Quiz"("scheduled_for");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_post_id_user_id_key" ON "Reaction"("post_id", "user_id");

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create GIN index for full-text search
CREATE INDEX IF NOT EXISTS "Post_fts_idx" ON "Post" USING gin(to_tsvector('portuguese', "title" || ' ' || "body"));
