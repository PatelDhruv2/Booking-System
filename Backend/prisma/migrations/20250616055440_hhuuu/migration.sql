-- CreateTable
CREATE TABLE "Poster" (
    "id" SERIAL NOT NULL,
    "movieId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Poster_movieId_idx" ON "Poster"("movieId");

-- AddForeignKey
ALTER TABLE "Poster" ADD CONSTRAINT "Poster_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
