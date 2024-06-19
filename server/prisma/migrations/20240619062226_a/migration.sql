-- AlterTable
ALTER TABLE `post` ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isBlocked` BOOLEAN NOT NULL DEFAULT false;
