import { apiHandler } from '@/lib/api-handler';
import { handleUnreadCountRequest } from './handler';

export const GET = apiHandler(handleUnreadCountRequest);
