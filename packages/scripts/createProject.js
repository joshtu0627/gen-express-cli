import fsPromises from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSpinner } from 'nanospinner';
import { runCommand } from '../utils/exec.js';

async function createStructure(projectName, template) {
  const TEMPLATES_PATH = path.join(path.dirname(fileURLToPath(import.meta.url)), '../', 'templates');
  const COMMON_PATH = path.join(TEMPLATES_PATH, 'common');
  const PROJECT_PATH = path.join(process.cwd(), projectName);
  try {
    await fsPromises.cp(path.join(TEMPLATES_PATH, template), PROJECT_PATH, { recursive: true });
    await fsPromises.cp(COMMON_PATH, PROJECT_PATH, { recursive: true });
    await fsPromises.rename(path.join(PROJECT_PATH, 'gitignore'), path.join(PROJECT_PATH, '.gitignore'));
  } catch (error) {
    throw error;
  }
}

async function installDependencies(projectName, projectManager) {
  if (projectManager === 'npm') {
    await runCommand(`cd ${projectName} && npm install && cd ..`);
  } else if (projectManager === 'yarn') {
    await runCommand(`cd ${projectName} && yarn && cd ..`);
  } else if (projectManager === 'pnpm') {
    await runCommand(`cd ${projectName} && pnpm install && cd ..`);
  }
}

export default async function createProject({ projectName, template, projectManager }) {
  const spinner = createSpinner('Creating project...');
  try {
    spinner.start();

    await createStructure(projectName, template);
    await installDependencies(projectName, projectManager);
    spinner.success({ text: 'Project created successfully' });
  } catch (error) {
    spinner.error({ text: 'Failed to create project' });
    throw error;
  }
}
