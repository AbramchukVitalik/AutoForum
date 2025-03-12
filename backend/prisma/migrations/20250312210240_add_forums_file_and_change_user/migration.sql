/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Forums" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "numberOfTopics" INTEGER NOT NULL,
    "numberOfMessages" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "numberOfMessages" INTEGER NOT NULL,
    "numberOfViews" INTEGER NOT NULL,
    "forumId" INTEGER NOT NULL,
    CONSTRAINT "Topics_forumId_fkey" FOREIGN KEY ("forumId") REFERENCES "Forums" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "like" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "topicsId" INTEGER NOT NULL,
    "createAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Messages_topicsId_fkey" FOREIGN KEY ("topicsId") REFERENCES "Topics" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
