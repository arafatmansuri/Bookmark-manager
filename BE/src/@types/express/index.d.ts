import * as express from 'express';
import { Schema } from '../../types';
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      user?: Record<Schema>;
      users?: Record<Schema[]>;
      userIndex?: Record<number>;
    }
  }
}
