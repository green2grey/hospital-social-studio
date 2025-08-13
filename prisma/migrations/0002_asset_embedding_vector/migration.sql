-- Ensure pgvector is enabled (no-op if already)
create extension if not exists vector;

-- Replace bytea embedding with vector(1536)
alter table "public"."Asset" drop column if exists "embedding";
alter table "public"."Asset" add column "embedding" vector(1536);


