import { z } from 'zod/v4'

const IS_REQUIRED_ERROR_MESSAGE = 'Is required'

z.config({
  customError: issue => {
    if (issue.code === 'too_small' && issue.minimum === 1) {
      return IS_REQUIRED_ERROR_MESSAGE
    }

    if (issue.code === 'invalid_type' && issue.input == null) {
      return IS_REQUIRED_ERROR_MESSAGE
    }

    if (
      issue.code === 'invalid_type' &&
      issue.expected === 'number' &&
      isNaN(Number(issue.input))
    ) {
      return IS_REQUIRED_ERROR_MESSAGE
    }

    return issue.message
  },
})
