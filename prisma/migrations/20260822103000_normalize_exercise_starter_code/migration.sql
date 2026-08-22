-- Convert escaped newline sequences from the curated SQL seed into editor line breaks.
UPDATE "exercises"
SET "starter_code" = replace("starter_code", E'\\n', E'\n'),
    "updated_at" = CURRENT_TIMESTAMP
WHERE "starter_code" LIKE E'%\\n%';
