import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "@shared/errors/AppError";
import { UsersRepository } from "@modules/accounts/infra/typeorm/repositories/UsersRepository";

interface IPayload {
  sub: string;
}

export async function ensureAdmin(request: Request, response: Response, next: NextFunction) {
  const { id } = request.user;
  
  const usersRepository = new UsersRepository();  
  const user = await usersRepository.findById(id);
  
  if (!user.isAdmin) {
    throw new AppError("User isn't admin", 401);
  }
  next();
}