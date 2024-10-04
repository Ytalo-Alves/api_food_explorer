-- CreateTable
CREATE TABLE "ingredients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dishesId" TEXT NOT NULL,
    CONSTRAINT "ingredients_dishesId_fkey" FOREIGN KEY ("dishesId") REFERENCES "dishes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ingredients_id_key" ON "ingredients"("id");
