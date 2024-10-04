-- CreateTable
CREATE TABLE "ordersitems" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "ordersId" TEXT NOT NULL,
    "dishesId" TEXT NOT NULL,
    CONSTRAINT "ordersitems_ordersId_fkey" FOREIGN KEY ("ordersId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ordersitems_dishesId_fkey" FOREIGN KEY ("dishesId") REFERENCES "dishes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ordersitems_id_key" ON "ordersitems"("id");
