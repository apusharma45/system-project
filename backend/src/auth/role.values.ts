export const ROLE_VALUES = ['PATIENT', 'DOCTOR', 'PHARMACY', 'DIAGNOSTIC', 'ADMIN'] as const;
export type RoleValue = (typeof ROLE_VALUES)[number];
