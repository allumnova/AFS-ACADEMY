-- Create Batches table
CREATE TABLE IF NOT EXISTS `Batches` (
  `id` CHAR(36) BINARY NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `courseId` CHAR(36) BINARY NOT NULL,
  `instructorId` CHAR(36) BINARY,
  `startDate` DATE,
  `endDate` DATE,
  `startTime` TIME,
  `endTime` TIME,
  `days` JSON,
  `status` ENUM('upcoming', 'active', 'completed', 'cancelled') DEFAULT 'upcoming',
  `maxCapacity` INTEGER DEFAULT 30,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`courseId`) REFERENCES `Courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`instructorId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create BatchStudents table
CREATE TABLE IF NOT EXISTS `BatchStudents` (
  `id` CHAR(36) BINARY NOT NULL,
  `batchId` CHAR(36) BINARY NOT NULL,
  `studentId` CHAR(36) BINARY NOT NULL,
  `joiningDate` DATETIME,
  `status` ENUM('active', 'dropped', 'completed') DEFAULT 'active',
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `batch_students_unique` (`batchId`, `studentId`),
  FOREIGN KEY (`batchId`) REFERENCES `Batches` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`studentId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create SystemSettings table
CREATE TABLE IF NOT EXISTS `SystemSettings` (
  `id` CHAR(36) BINARY NOT NULL,
  `key` VARCHAR(255) NOT NULL,
  `value` TEXT,
  `category` VARCHAR(255) DEFAULT 'general',
  `description` VARCHAR(255),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB;

-- Create WatchHistories table
CREATE TABLE IF NOT EXISTS `WatchHistories` (
  `id` CHAR(36) BINARY NOT NULL,
  `userId` CHAR(36) BINARY NOT NULL,
  `lectureId` CHAR(36) BINARY NOT NULL,
  `progressSeconds` INTEGER NOT NULL DEFAULT 0,
  `isCompleted` TINYINT(1) DEFAULT 0,
  `lastWatchedAt` DATETIME,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `watch_histories_unique` (`userId`, `lectureId`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`lectureId`) REFERENCES `Lectures` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create Certificates table
CREATE TABLE IF NOT EXISTS `Certificates` (
  `id` CHAR(36) BINARY NOT NULL,
  `userId` CHAR(36) BINARY NOT NULL,
  `courseId` CHAR(36) BINARY NOT NULL,
  `issueDate` DATETIME,
  `certificateUrl` VARCHAR(255),
  `uniqueId` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniqueId` (`uniqueId`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`courseId`) REFERENCES `Courses` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Create AuditLogs table
CREATE TABLE IF NOT EXISTS `AuditLogs` (
  `id` CHAR(36) BINARY NOT NULL,
  `userId` CHAR(36) BINARY NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `target` VARCHAR(255),
  `ipAddress` VARCHAR(255),
  `details` JSON,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
