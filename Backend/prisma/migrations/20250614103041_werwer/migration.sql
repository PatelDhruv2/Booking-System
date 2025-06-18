/*
  Warnings:

  - A unique constraint covering the columns `[seatNo,screenId]` on the table `Seat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `Show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Show" ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Seat_seatNo_screenId_key" ON "Seat"("seatNo", "screenId");

-- CreateIndex
CREATE INDEX "Show_screenId_startTime_idx" ON "Show"("screenId", "startTime");
