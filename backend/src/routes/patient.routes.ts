import { Router } from 'express';
import { getPatients, getPatientById, createPatient, updatePatient, deletePatient } from '../controllers/patient.controller';
import {authMiddleware} from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.get('/patients', getPatients);
router.post('/patients', createPatient);
router.get('/patients/:id', getPatientById);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

export default router;