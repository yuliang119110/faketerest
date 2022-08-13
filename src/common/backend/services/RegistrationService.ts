import { Sequelize } from 'sequelize-typescript';
import * as pg from 'pg';
import Registration from '../models/Registration.model';

class RegistrationService {
  public static instance: RegistrationService;
  private _connection: Sequelize;

  private constructor() {
    this._connection = new Sequelize(
      `postgres://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
      {
        models: [__dirname + '/**/*.model.ts'],
        dialect: pg,
        dialectOptions: {
          // ssl: { require: true, rejectUnauthorized: false }
        }
      }
    );
    RegistrationService.instance = this;
    this.connection.addModels([Registration]);
  }

  public static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    return new RegistrationService();
  }

  get connection(): Sequelize {
    return this._connection;
  }

  public async checkConnection() {
    await this._connection.authenticate();
    console.log('---DB CONNECTION OPENED---');
  }
}

const RegService = RegistrationService.getInstance();

export default RegService;
