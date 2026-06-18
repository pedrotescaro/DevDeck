-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "is_edited" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updated_at" TIMESTAMP(3);
