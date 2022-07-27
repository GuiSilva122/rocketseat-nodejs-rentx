import { Specification } from "@modules/cars/infra/typeorm/entities/Specification";

interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

interface ISpecificationsRepository {
  findByIds(ids: string[]): Promise<Specification[]>;
  findByName(name: string): Promise<Specification>;
  create({ name, description }: ICreateSpecificationDTO): Promise<Specification>;
}

export { ISpecificationsRepository, ICreateSpecificationDTO };