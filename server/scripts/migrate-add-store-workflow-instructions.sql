-- Migration: add instructions_md to store_workflows
-- Safe to run multiple times.

ALTER TABLE store_workflows
  ADD COLUMN IF NOT EXISTS instructions_md TEXT;
