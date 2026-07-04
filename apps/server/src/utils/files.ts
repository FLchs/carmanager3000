import { FileError } from "#lib/serviceErrors";
import { writeFile } from "fs/promises";
import path from "path";
import { err, ok } from "true-myth/result";

import { rootDir } from "./paths";
export const saveFile = async (file: File) => {
  try {
    const data = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(rootDir, "uploads", file.name), data);
    return ok(`/uploads/${file.name}`);
  } catch (error) {
    return err(new FileError(error));
  }
};
