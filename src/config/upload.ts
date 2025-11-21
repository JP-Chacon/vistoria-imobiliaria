import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';

import multer from 'multer';

const ensureDirectory = (dir: string) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
};

export const uploadsRoot = path.resolve(process.cwd(), 'uploads');
export const inspectionUploadsRoot = path.resolve(uploadsRoot, 'inspections');

export const inspectionAttachmentsUpload = multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => {
      const inspectionId = req.params.id;

      if (!inspectionId) {
        return cb(new Error('ID da vistoria não informado.'));
      }

      const folder = path.resolve(inspectionUploadsRoot, inspectionId);
      ensureDirectory(folder);
      cb(null, folder);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const sanitized = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      cb(null, `${timestamp}-${sanitized}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas.'));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

