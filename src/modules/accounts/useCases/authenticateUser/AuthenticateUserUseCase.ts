import { compare } from "bcryptjs";
import { inject, injectable } from "tsyringe";
import { sign } from "jsonwebtoken";
import { IUsersRepository } from "@modules/accounts/repositories/IUsersRepository";
import { AppError } from "@shared/errors/AppError";

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    name: string;
    email: string;
  },
  token: string;
}

@injectable()
class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if(!user) {
      throw new AppError("Email or password incorrect");
    }
    
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Email or password incorrect");
    }

    const token = sign({}, "a8037c92c66374de169a9834428f38a5", {
      subject: user.id,
      expiresIn: "1d"
    });
    return {
      user: { name: user.name, email: user.email },
      token
    };
  }
}

export { AuthenticateUserUseCase }