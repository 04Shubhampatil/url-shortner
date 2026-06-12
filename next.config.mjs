/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname)
  }
};

export default nextConfig;
