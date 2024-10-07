-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_dishes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_dishes" ("category", "description", "id", "image", "price", "title") SELECT "category", "description", "id", "image", "price", "title" FROM "dishes";
DROP TABLE "dishes";
ALTER TABLE "new_dishes" RENAME TO "dishes";
CREATE UNIQUE INDEX "dishes_id_key" ON "dishes"("id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
