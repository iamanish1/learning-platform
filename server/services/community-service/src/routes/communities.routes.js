const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../../../../shared/middleware');
const { successResponse } = require('../../../../shared/utils');

// Placeholder routes - to be implemented later
router.get('/', asyncHandler(async (req, res) => {
  return successResponse(res, { message: 'Community service is running' }, 'Community service endpoint');
}));

module.exports = router;

