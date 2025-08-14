import { Rect, User } from '../types/type';

// Global state
export const rectangles = new Map<string, Rect>();
export const users = new Map<string, User>(); 
export const userSockets = new Map<string, string>(); 
export const socketToUserId = new Map<string, string>();
