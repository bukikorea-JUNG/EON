export interface Product {
  id: string;
  name: string;
  category: 'driver' | 'wood' | 'iron';
  price: string;
  description: string;
  specs: {
    loft?: string;
    shaft?: string;
    composition?: string;
  };
  image: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}