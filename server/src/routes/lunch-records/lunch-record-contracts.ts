import {
  API_ERROR_MESSAGE_SCHEMA,
  API_VALIDATION_ERROR_MESSAGE_SCHEMA,
  LUNCH_RECORD_CREATE_SCHEMA,
  LUNCH_RECORD_SCHEMA,
} from 'contracts'
import { z } from 'zod/v4'
import { ApiContract } from '../../types/api-contract.js'

export const LunchRecordContracts = {
  getLunchRecords: {
    method: 'GET',
    url: '/api/lunchRecords',
    schema: {
      response: {
        200: z.array(LUNCH_RECORD_SCHEMA),
        401: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Lunch records'],
      summary: 'Get all lunch records',
    },
  },

  getUserLunchRecords: {
    method: 'GET',
    url: '/api/users/:userId/lunchRecords',
    schema: {
      params: z.object({
        userId: z.coerce.number(),
      }),
      response: {
        200: z.array(LUNCH_RECORD_SCHEMA),
        401: API_ERROR_MESSAGE_SCHEMA,
        400: API_VALIDATION_ERROR_MESSAGE_SCHEMA,
        404: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Lunch records'],
      summary: 'Get user lunch records',
    },
  },

  createLunchRecord: {
    method: 'POST',
    url: '/api/lunchRecords',
    schema: {
      body: LUNCH_RECORD_CREATE_SCHEMA,
      response: {
        201: LUNCH_RECORD_SCHEMA,
        401: API_ERROR_MESSAGE_SCHEMA,
        400: API_VALIDATION_ERROR_MESSAGE_SCHEMA,
        404: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Lunch records'],
      summary: 'Create lunch record',
    },
  },

  deleteLunchRecord: {
    method: 'DELETE',
    url: '/api/lunchRecords/:id',
    schema: {
      params: z.object({
        id: z.coerce.number(),
      }),
      response: {
        204: z.void(),
        401: API_ERROR_MESSAGE_SCHEMA,
        403: API_ERROR_MESSAGE_SCHEMA,
        400: API_VALIDATION_ERROR_MESSAGE_SCHEMA,
        404: API_ERROR_MESSAGE_SCHEMA,
      },
      tags: ['Lunch records'],
      summary: 'Delete lunch record',
    },
  },
} satisfies ApiContract
