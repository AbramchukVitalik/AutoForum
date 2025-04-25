-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LikedMessage" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idMessage" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,
    CONSTRAINT "LikedMessage_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_LikedMessage" ("id", "idMessage", "profileId") SELECT "id", "idMessage", "profileId" FROM "LikedMessage";
DROP TABLE "LikedMessage";
ALTER TABLE "new_LikedMessage" RENAME TO "LikedMessage";
CREATE UNIQUE INDEX "LikedMessage_profileId_key" ON "LikedMessage"("profileId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
