// fileSorting.ts
import { DriveFile, SortFilterConfig } from "@util/types";





export function sortDriveFiles(files: DriveFile[], {property, isAscending}: SortFilterConfig): void {
    files.sort((a: DriveFile, b: DriveFile) => {
      if (property === 'size') {
        return isAscending ? +a.size! - +b.size! : +b.size! - +a.size!;
      } else if (property === 'createdAt') {
        return isAscending ? Date.parse(a.createdAt!) - Date.parse(b.createdAt!) : Date.parse(b.createdAt!) - Date.parse(a.createdAt!);
      } else if (property === 'updatedAt') {
        return isAscending ? Date.parse(a.updatedAt!) - Date.parse(b.updatedAt!) : Date.parse(b.updatedAt!) - Date.parse(a.updatedAt!);
      } else {
        return isAscending ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
    });
  }