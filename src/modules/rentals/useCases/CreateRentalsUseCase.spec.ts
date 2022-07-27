import dayjs from "dayjs";
import { AppError } from "@shared/errors/AppError";
import { RentalsRepositoryInMemory } from "../repositories/in-memory/RentalsRepositoryInMemory";
import { CreateRentalsUseCase } from "./CreateRentalsUseCase";
import { IDateProvider } from "@shared/container/providers/DateProvider/IDateProvider";
import { DayjsDateProvider } from "@shared/container/providers/DateProvider/implementations/DayjsDateProvider";

let rentalsRepositoryInMemory: RentalsRepositoryInMemory;
let dayjsDateProvider: IDateProvider;
let createRentalsUseCase: CreateRentalsUseCase;

describe("Create Rental", () => {
  const dayAdd24Hours = dayjs().add(1, "day").toDate();

  beforeEach(() => {
    rentalsRepositoryInMemory = new RentalsRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    createRentalsUseCase = new CreateRentalsUseCase(rentalsRepositoryInMemory, dayjsDateProvider);
  });

  it("shoulg be able to create a new rental", async () => {
    const rental = await createRentalsUseCase.execute({
      user_id: "12345",
      car_id: "121212",
      expected_return_date: dayAdd24Hours
    });
    expect(rental).toHaveProperty("id");
    expect(rental).toHaveProperty("start_date");
  });

  it("shoulg not be able to create a new rental if there is another open to the same user", async () => {
    await createRentalsUseCase.execute({
      user_id: "12345",
      car_id: "121213",
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
    await createRentalsUseCase.execute({
      user_id: "123",
      car_id: "test",
      expected_return_date: dayAdd24Hours
    });

    expect(async () => await createRentalsUseCase.execute({
      user_id: "321",
      car_id: "test",
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