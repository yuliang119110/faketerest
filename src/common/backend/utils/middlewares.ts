import type { NextApiRequest, NextApiResponse } from 'next';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { REGISTRATION_ERROR } from '../models/constants/code';
import { AUTH_TOKEN_COOKIE_KEY } from '../../constants/commons';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { NextFunction, UnauthorizedException } from 'next-api-decorators';
import Registration from '../models/Registration.model';

export const setDefaultMessageByCode = (
  res: NextApiResponse,
  code: StatusCodes,
  customMessage?: string,
  options?: { errorCode: typeof REGISTRATION_ERROR }
) => {
  res.status(code).json({
    error: customMessage || getReasonPhrase(code),
    ...(options || {})
  });
};

export const jwtCheck = async (token: string) => {
  jwt.verify(token, process.env.SECRET, {
    algorithms: ['HS256']
  });
  const payload = jwt.decode(token) as { userId: number };
  const count = await Registration.count({ where: { id: payload.userId } });
  if (count !== 1) {
    throw new Error('Could not find user');
  }
  return payload.userId;
};

export const jwtMiddlewareFn = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextFunction
) => {
  const token = req.cookies[AUTH_TOKEN_COOKIE_KEY];
  if (token) {
    try {
      await jwtCheck(token);
      next();
      return;
    } catch (e) {
      console.error(e);
      res.setHeader(
        'Set-Cookie',
        cookie.serialize(AUTH_TOKEN_COOKIE_KEY, '', { httpOnly: true })
      );
    }
  }
  res.status(StatusCodes.UNAUTHORIZED).json({});
  throw new UnauthorizedException();
};
