export interface LocationEquipment {
  equipmentId: string;
  quantity: number;
}

export interface Location {
  id: string;
  name: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  equipment: LocationEquipment[];
}
