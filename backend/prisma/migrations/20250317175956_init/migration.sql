-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" SERIAL NOT NULL,
    "destination" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "description" TEXT NOT NULL,
    "numberOfPersons" INTEGER NOT NULL,
    "interests" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Day" (
    "id" SERIAL NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "itineraryId" INTEGER NOT NULL,
    "morning" TEXT NOT NULL,
    "afternoon" TEXT NOT NULL,
    "evening" TEXT NOT NULL,
    "proTip" TEXT NOT NULL,

    CONSTRAINT "Day_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Place" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "dayId" INTEGER NOT NULL,

    CONSTRAINT "Place_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "placeId" TEXT NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Place_placeId_key" ON "Place"("placeId");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Day" ADD CONSTRAINT "Day_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Place" ADD CONSTRAINT "Place_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "Place"("placeId") ON DELETE RESTRICT ON UPDATE CASCADE;
