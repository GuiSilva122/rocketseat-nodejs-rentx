import { inject, injectable } from "tsyringe";
import { ICarsRepository } from "@modules/cars/repositories/ICarsRepository";
import { IRentalsRepository } from "@modules/rentals/repositories/IRentalsRepository";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { AppError } from "@shared/errors/AppError";
import { Rental } from "@modules/rentals/infra/typeorm/entities/Rental";

interface IRequest {
  id: string;
}

@injectable()
class DevolutionRentalUsecase {
  constructor(
    @inject("RentalsRepository")
    private rentalsRepository: IRentalsRepository,
    @inject("CarsRepository")
    private carsRepository: ICarsRepository,
    @inject("DateProvider")
    private dateProvider: IDateProvider
  ){}

  async execute({ id }: IRequest): Promise<Rental> {
    const minimum_daily = 1;
    const rental = await this.rentalsRepository.findById(id);
    const car = await this.carsRepository.findById(rental.car_id);
    if(!rental) throw new AppError("Rental does not exists!")

    const dateNow = this.dateProvider.dateNow();
    let daily = this.dateProvider.compareInDays(rental.expected_return_date, dateNow);
    const delay = this.dateProvider.compareInDays(dateNow, rental.expected_return_date);

    if (daily <= 0) daily = minimum_daily;

    let total = 0;
    if (delay > 0) total = delay * car.fine_amount;
    total += daily * car.daily_rate;
    
    rental.end_date = dateNow;
    rental.total = total;

    await this.rentalsRepository.create(rental);
    await this.carsRepository.updateAvailable(rental.car_id, true);
    return rental;
  }
}

export { DevolutionRentalUsecase };