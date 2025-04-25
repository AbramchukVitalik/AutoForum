-- CreateTable
CREATE TABLE "LikedMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idMessage" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "LikedMessage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "LikedMessage_profileId_key" ON "LikedMessage"("profileId");
