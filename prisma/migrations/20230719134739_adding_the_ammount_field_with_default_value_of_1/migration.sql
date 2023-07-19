-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Rellies" (
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "ammount" INTEGER DEFAULT 1,

    PRIMARY KEY ("userId", "postId"),
    CONSTRAINT "Rellies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Rellies_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Rellies" ("ammount", "postId", "userId") SELECT "ammount", "postId", "userId" FROM "Rellies";
DROP TABLE "Rellies";
ALTER TABLE "new_Rellies" RENAME TO "Rellies";
CREATE INDEX "Rellies_userId_idx" ON "Rellies"("userId");
CREATE INDEX "Rellies_postId_idx" ON "Rellies"("postId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
