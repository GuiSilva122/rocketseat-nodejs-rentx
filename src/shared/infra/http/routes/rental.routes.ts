import { CreateRentalsController } from '@modules/rentals/useCases/createRental/CreateRentalsController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { ListRentalsByUserController } from '@modules/rentals/useCases/listRentalsByUser/ListRentalsByUserController';
import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();

const createRentalsController = new CreateRentalsController();
const devolutionRentalController = new DevolutionRentalController();
const listRentalsByUserController = new ListRentalsByUserController();

rentalRoutes.post("/",  ensureAuthenticated, createRentalsController.handle);
rentalRoutes.get("/user",  ensureAuthenticated, listRentalsByUserController.handle);
rentalRoutes.post("/devolution/:id",  ensureAuthenticated, devolutionRentalController.handle);

export { rentalRoutes };