-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "numberOfMessages" INTEGER NOT NULL,
    "numberOfViews" INTEGER NOT NULL,
    "question" TEXT,
    "forumId" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Topics_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forums" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Topics" ("author", "authorId", "forumId", "id", "numberOfMessages", "numberOfViews", "question", "title") SELECT "author", "authorId", "forumId", "id", "numberOfMessages", "numberOfViews", "question", "title" FROM "Topics";
DROP TABLE "Topics";
ALTER TABLE "new_Topics" RENAME TO "Topics";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
