import dayjs from "dayjs";
import { AppError } from "@shared/errors/AppError";
import { CreateRentalsUseCase } from "./CreateRentalsUseCase";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";
import { CarsRepositoryInMemory } from "@modules/cars/repositories/in-memory/CarsRepositoryInMemory";
import { RentalsRepositoryInMemory } from "@modules/rentals/repositories/in-memory/RentalsRepositoryInMemory";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let carsRepository: CarsRepositoryInMemory;
let createRentalsUseCase: CreateRentalsUseCase;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    carsRepository = new CarsRepositoryInMemory();
    createRentalsUseCase = new CreateRentalsUseCase(rentalsRepositoryInMemory, dayjsDateProvider, carsRepository);
  });

  it("shoulg be able to create a new rental", async () => {
    const car = await carsRepository.create({
      name: "Name Car", 
      description: "Description Car", 
      daily_rate: 100, 
      license_plate: "ABC-1234", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category"
    });

    const rental = await createRentalsUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });
    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("shoulg not be able to create a new rental if there is another open to the same user", async () => {
    const car = await carsRepository.create({
      name: "Name Car", 
      description: "Description Car", 
      daily_rate: 100, 
      license_plate: "ABC-1234", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category"
    });

    await createRentalsUseCase.execute({
      user_id: "12345",
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });

    expect(async () => await createRentalsUseCase.execute({
      user_id: "12345",
      car_id: "121212",
      expected_return_date: dayAdd24Hours
    }))
      .rejects
      .toBeInstanceOf(AppError);
  });

  it("shoulg not be able to create a new rental if there is another open to the same car", async () => {
    const car = await carsRepository.create({
      name: "Name Car", 
      description: "Description Car", 
      daily_rate: 100, 
      license_plate: "ABC-1234", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category"
    });
    const car2 = await carsRepository.create({
      name: "Name Car", 
      description: "Description Car", 
      daily_rate: 100, 
      license_plate: "ABC-1234", 
      fine_amount: 60, 
      brand: "Brand", 
      category_id: "category"
    });
    await createRentalsUseCase.execute({
      user_id: "123",
      car_id: car.id,
      expected_return_date: dayAdd24Hours
    });

    expect(async () => await createRentalsUseCase.execute({
      user_id: "321",
      car_id: car2.id,
      expected_return_date: dayAdd24Hours
    }))
      .rejects
      .toBeInstanceOf(AppError);
  });

  it("shoulg not be able to create a new rental with invalid return time", async () => {
    expect(async () => await createRentalsUseCase.execute({
      user_id: "321",
      car_id: "test",
      expected_return_date: dayjs().toDate()
    }))
      .rejects
      .toBeInstanceOf(AppError);
  });
});