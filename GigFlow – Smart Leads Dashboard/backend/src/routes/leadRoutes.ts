import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportCSV,
} from '../controllers/leadController';
import { protect } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

// Protect all lead routes
router.use(protect);

// Leads general routes
router.get('/', getLeads);
router.post('/', createLead);

// Export CSV route (Must be defined BEFORE /:id to avoid express route parameter collision)
router.get('/export/csv', authorize('Admin'), exportCSV);

// Lead details and specific actions routes
router.get('/:id', getLeadById);
router.put('/:id', updateLead);
router.delete('/:id', authorize('Admin'), deleteLead);

export default router;
