// utils/dateFormat.ts
export const formatDate = (date: Date) => date.toISOString().split('T')[0];
