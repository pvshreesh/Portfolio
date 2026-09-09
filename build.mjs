import { copyFile, cp, mkdir } from 'node:fs/promises';

// Only public files enter the deployable directory; tooling and notes stay out.
await mkdir(new URL('./dist/assets/', import.meta.url), { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(new URL(file, import.meta.url), new URL('dist/' + file, import.meta.url));
}
await cp(new URL('./assets/', import.meta.url), new URL('./dist/assets/', import.meta.url), { recursive: true });
console.log('Static portfolio built in dist/');
