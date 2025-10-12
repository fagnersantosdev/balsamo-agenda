/*
  Warnings:

  - You are about to drop the column `active` on the `Service` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL DEFAULT 0,
    "durationMin" INTEGER NOT NULL,
    "details" TEXT NOT NULL DEFAULT '[]'
);
INSERT INTO "new_Service" ("durationMin", "id", "name", "price") SELECT "durationMin", "id", "name", "price" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
