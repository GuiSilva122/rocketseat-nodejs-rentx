import { Request, Response } from "express";
import { container } from "tsyringe";
import { DevolutionRentalUsecase } from "./DevolutionRentalUsecase";

class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { id } = request.params;

    const devolutionRentalUseCase = container.resolve(DevolutionRentalUsecase);
    const rental = await devolutionRentalUseCase.execute({ id });
    return response.status(200).json(rental);
  }
}

export { DevolutionRentalController };