-- AlterTable
ALTER TABLE "Answer" ADD COLUMN "parent_id" TEXT;

-- CreateIndex
CREATE INDEX "Answer_parent_id_idx" ON "Answer"("parent_id");

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_parent_id_fkey"
  FOREIGN KEY ("parent_id") REFERENCES "Answer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
