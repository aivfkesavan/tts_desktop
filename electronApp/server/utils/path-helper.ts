import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import os from 'os';

const homeDirectory = os.homedir()

const mainPath = ".tts"

export function getRoot() {
  return path.join(homeDirectory, mainPath)
}

export function createPath(newPath: string[] = []) {
  return path.join(getRoot(), ...newPath)
}

export function checkIsDirExists(directoryPath = "") {
  if (!existsSync(directoryPath)) {
    try {
      mkdirSync(directoryPath, { recursive: true });
      console.log(`Directory created: ${directoryPath}`);
      return false

    } catch (err) {
      console.error(`Error creating directory: ${err.message}`);
      return false
    }

  } else {
    console.log(`Directory already exists: ${directoryPath}`);
    return true
  }
}

export function checkPathsSetup() {
  const directoryPath = getRoot()
  checkIsDirExists(directoryPath)
}