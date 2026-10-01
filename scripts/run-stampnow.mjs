import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Separate process preserves the imported application's sessions, jobs and API implementation.
const child = spawn(process.execPath, ['--env-file-if-exists=.env', 'src/server.js'], {
  cwd: fileURLToPath(new URL('../services/stampnow/', import.meta.url)),
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: process.env.STAMPNOW_APP_PORT || '4001',
    NODE_ENV: 'development',
    JOBS_ENABLED: 'false',
    AUTOMATIONS_ENABLED: 'false',
  },
});
child.on('error', (error) => { console.error(error.message); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
