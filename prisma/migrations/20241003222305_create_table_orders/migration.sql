-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "orderStatus" TEXT NOT NULL,
    "totalPrice" TEXT NOT NULL,
    "paymentMethod" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_id_key" ON "orders"("id");
