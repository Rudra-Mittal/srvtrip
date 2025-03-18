/*
  Warnings:

  - The primary key for the `Day` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `dayId` on the `Place` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Place" DROP CONSTRAINT "Place_dayId_fkey";

-- AlterTable
ALTER TABLE "Day" DROP CONSTRAINT "Day_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Day_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Day_id_seq";

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "dayId";

-- CreateTable
CREATE TABLE "_DayToPlace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_DayToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DayToPlace_B_index" ON "_DayToPlace"("B");

-- AddForeignKey
ALTER TABLE "_DayToPlace" ADD CONSTRAINT "_DayToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "Day"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DayToPlace" ADD CONSTRAINT "_DayToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "Place"("id") ON DELETE CASCADE ON UPDATE CASCADE;
