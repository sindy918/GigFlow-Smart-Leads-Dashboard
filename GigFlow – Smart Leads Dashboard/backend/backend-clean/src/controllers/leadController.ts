import { Request, Response } from 'express';
import { Lead } from '../models/Lead';

interface FilterQuery {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  status?: string;
  source?: string;
}

// @desc    Get all leads with search, filtering, sorting, and pagination
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, source, sort, page = '1', limit = '10' } = req.query;

    const query: FilterQuery = {};

    // 1. Search Query (Name or Email)
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    // 2. Filter Query (Status)
    if (status && typeof status === 'string' && status !== 'All' && status.trim() !== '') {
      query.status = status;
    }

    // 3. Filter Query (Source)
    if (source && typeof source === 'string' && source !== 'All' && source.trim() !== '') {
      query.source = source;
    }

    // 4. Sorting
    let sortQuery: { [key: string]: 1 | -1 } = { createdAt: -1 }; // default latest
    if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    // 5. Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skipNum = (pageNum - 1) * limitNum;

    // Execute query
    const totalLeads = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalLeads / limitNum);

    const leads = await Lead.find(query)
      .sort(sortQuery)
      .skip(skipNum)
      .limit(limitNum);

    res.json({
      page: pageNum,
      limit: limitNum,
      totalLeads,
      totalPages,
      leads,
    });
  } catch (error) {
    console.error('Get Leads error:', error);
    res.status(500).json({ message: 'Server error while fetching leads', error: (error as Error).message });
  }
};

// @desc    Get a single lead by ID
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    res.json(lead);
  } catch (error) {
    console.error('Get Lead By ID error:', error);
    if ((error as any).kind === 'ObjectId') {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(500).json({ message: 'Server error while fetching lead details' });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    if (!name || !email || !source) {
      res.status(400).json({ message: 'Please provide name, email, and source' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: 'Invalid email format' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create Lead error:', error);
    res.status(500).json({ message: 'Server error while creating lead', error: (error as Error).message });
  }
};

// @desc    Update an existing lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    // Update fields if provided
    if (name) lead.name = name;
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Invalid email format' });
        return;
      }
      lead.email = email;
    }
    if (status) lead.status = status;
    if (source) lead.source = source;

    const updatedLead = await lead.save();
    res.json(updatedLead);
  } catch (error) {
    console.error('Update Lead error:', error);
    if ((error as any).kind === 'ObjectId') {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(500).json({ message: 'Server error while updating lead', error: (error as Error).message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private (Admin Only - verified by router + auth/role middlewares)
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }

    await lead.deleteOne();
    res.json({ message: 'Lead successfully deleted' });
  } catch (error) {
    console.error('Delete Lead error:', error);
    if ((error as any).kind === 'ObjectId') {
      res.status(404).json({ message: 'Lead not found' });
      return;
    }
    res.status(500).json({ message: 'Server error while deleting lead' });
  }
};

// @desc    Export all leads (filtered) to CSV
// @route   GET /api/leads/export/csv
// @access  Private (Admin Only)
export const exportCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, status, source, sort } = req.query;

    const query: FilterQuery = {};

    // Apply exact same filters as the list endpoint
    if (search && typeof search === 'string' && search.trim() !== '') {
      const searchRegex = { $regex: search.trim(), $options: 'i' };
      query.$or = [
        { name: searchRegex },
        { email: searchRegex }
      ];
    }

    if (status && typeof status === 'string' && status !== 'All' && status.trim() !== '') {
      query.status = status;
    }

    if (source && typeof source === 'string' && source !== 'All' && source.trim() !== '') {
      query.source = source;
    }

    let sortQuery: { [key: string]: 1 | -1 } = { createdAt: -1 };
    if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    }

    // Retrieve all matched records without page limits for CSV export
    const leads = await Lead.find(query).sort(sortQuery);

    // Build CSV Content
    let csv = 'Name,Email,Status,Source,Created At\n';
    
    leads.forEach((lead) => {
      // Escape commas, quotes and newlines
      const escapedName = `"${lead.name.replace(/"/g, '""')}"`;
      const escapedEmail = `"${lead.email.replace(/"/g, '""')}"`;
      const escapedStatus = `"${lead.status}"`;
      const escapedSource = `"${lead.source}"`;
      const escapedCreatedAt = `"${lead.createdAt.toISOString()}"`;

      csv += `${escapedName},${escapedEmail},${escapedStatus},${escapedSource},${escapedCreatedAt}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads_export.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('CSV Export error:', error);
    res.status(500).json({ message: 'Server error during CSV export', error: (error as Error).message });
  }
};
