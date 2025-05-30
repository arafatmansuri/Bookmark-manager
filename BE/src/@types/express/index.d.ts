import * as express from 'express';
//Custom Request Objects:
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, any>;
      users?: Record<string, any>;
      userIndex?: Record<number>;
    }
  }
}
