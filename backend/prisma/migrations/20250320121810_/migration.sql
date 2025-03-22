/*
  Warnings:

  - A unique constraint covering the columns `[dayNumber,itineraryId]` on the table `Day` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Day_dayNumber_itineraryId_key" ON "Day"("dayNumber", "itineraryId");
