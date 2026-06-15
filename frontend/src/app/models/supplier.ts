export interface Supplier {
  idSupplier?: string;
  documentNumber: string;
  documentType: 'F' | 'J';
  name: string;
  email: string;
  rg?: string;
  birthDate?: string;
  addressZipCode: string;
  addressStreet?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressState?: string;
  addressNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}
