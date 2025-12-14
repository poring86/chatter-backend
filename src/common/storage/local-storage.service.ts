import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { FileUploadOptions } from '../s3/file-upload-options.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LocalStorageService {
  private readonly uploadDir = 'uploads';

  constructor(private readonly configService: ConfigService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload({ key, file }: FileUploadOptions) {
    console.log('LocalStorageService: Uploading file', key);
    const filePath = path.join(this.uploadDir, key);
    const dir = path.dirname(filePath);
    console.log('LocalStorageService: Target path', filePath);
    
    if (!fs.existsSync(dir)) {
      console.log('LocalStorageService: Creating directory', dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    try {
      await fs.promises.writeFile(filePath, file as any);
      console.log('LocalStorageService: File written successfully');
    } catch (error) {
      console.error('LocalStorageService: Error writing file', error);
      throw error;
    }
  }

  getObjectUrl(key: string) {
    const port = this.configService.get('PORT');
    const url = `http://localhost:${port}/${this.uploadDir}/${key}`;
    console.log('LocalStorageService: Generated URL', url);
    return url;
  }
}
