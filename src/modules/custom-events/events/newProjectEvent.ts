'use client'

import { createEvent } from '@/modules/custom-events/createEvent'

export const newProjectEvent = createEvent<null>('newProject')
