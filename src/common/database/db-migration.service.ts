import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config, database, up } from 'migrate-mongo';

@Injectable()
export class DbMigrationService implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const dbMigrationConfig = {
      mongodb: {
        databaseName: this.configService.getOrThrow<string>('DB_NAME'),
        url: this.configService.getOrThrow<string>('MONGODB_URI'),
      },
      migrationsDir: `${__dirname}/../../migrations`,
      changelogCollectionName: 'changelog',
      migrationFileExtension: '.js',
    };

    config.set(dbMigrationConfig);
    const { db, client } = await database.connect();
    await up(db, client);
  }
}
