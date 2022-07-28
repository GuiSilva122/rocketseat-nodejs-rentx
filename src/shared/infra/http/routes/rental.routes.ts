import { CreateRentalsController } from '@modules/rentals/useCases/createRental/CreateRentalsController';
import { DevolutionRentalController } from '@modules/rentals/useCases/devolutionRental/DevolutionRentalController';
import { Router } from 'express';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();

const createRentalsController = new CreateRentalsController();
const devolutionRentalController = new DevolutionRentalController();

rentalRoutes.post("/",  ensureAuthenticated, createRentalsController.handle);
rentalRoutes.post("/devolution/:id",  ensureAuthenticated, devolutionRentalController.handle);

export { rentalRoutes };