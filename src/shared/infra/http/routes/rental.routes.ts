import { CreateRentalsController } from '@modules/rentals/useCases/CreateRentalsController';
import { Router } from 'express';
import { router } from '.';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const rentalRoutes = Router();

const createRentalsController = new CreateRentalsController();

rentalRoutes.post("/",  ensureAuthenticated, createRentalsController.handle);

export { rentalRoutes };

