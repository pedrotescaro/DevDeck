-- CreateTable
CREATE TABLE IF NOT EXISTS "MessageReaction" (
    "id" TEXT NOT NULL,
    "message_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "MessageReaction_message_id_user_id_emoji_key" ON "MessageReaction"("message_id", "user_id", "emoji");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessageReaction_message_id_idx" ON "MessageReaction"("message_id");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "MessageReaction_user_id_idx" ON "MessageReaction"("user_id");

-- AddForeignKey
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessageReaction_message_id_fkey') THEN
        ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'MessageReaction_user_id_fkey') THEN
        ALTER TABLE "MessageReaction" ADD CONSTRAINT "MessageReaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
