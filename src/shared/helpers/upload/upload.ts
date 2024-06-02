/* eslint-disable @typescript-eslint/ban-types */
import { v4 } from 'uuid';
import { readdir, unlink } from 'fs';
import { extname, join } from 'path';
import { BadRequestException, Logger } from '@nestjs/common';

export const imageFileFilter = (
  req,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new BadRequestException('Only image files jpg|jpeg|png|gif are allowed!'),
      false,
    );
  }
  callback(null, true);
};

export const editFileName = (
  req,
  file: Express.Multer.File,
  callback: Function,
) => {
  const uuid = v4();
  const fileExtName = extname(file.originalname);
  callback(null, `${uuid}${fileExtName}`);
};

export const unlinkFile = (path: string) => {
  try {
    readdir(path || 'files', (err, files) => {
      if (err) throw err;

      for (const file of files) {
        unlink(join(path || 'files', file), (err) => {
          if (err) throw err;
        });
      }
    });
    return true;
  } catch (error) {
    Logger.error(error.message, error.stack);
  }
};
