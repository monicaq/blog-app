import * as express from 'express';
import { Multer } from 'multer';

declare global {
     namespace Express {
       interface Request {
         userId?: number;
       }
     }
   }

declare module 'express-serve-static-core' {
  interface Request {
    file?: Express.Multer.File;
  }
}