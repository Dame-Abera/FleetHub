export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'OWNER' | 'ADMIN';
  phone?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
