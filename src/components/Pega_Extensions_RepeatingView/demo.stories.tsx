import type { StoryObj } from '@storybook/react';
import { PegaExtensionsRepeatingView } from './index';

export default {
  title: 'Templates/Repeating View',
  argTypes: {
    sourceConfig: {
      table: {
        disable: true
      }
    },
    parentDatapage: {
      table: {
        disable: true
      }
    },
    childDatapage: {
      table: {
        disable: true
      }
    },
    parentProperty: {
      table: {
        disable: true
      }
    },
    childProperty: {
      table: {
        disable: true
      }
    },
    targetViews: {
      table: {
        disable: true
      }
    },
    getPConnect: {
      table: {
        disable: true
      }
    }
  },
  component: PegaExtensionsRepeatingView
};

const parentData = [
  {
    id: 'ORD-001',
    orderNumber: 'ORD-001',
    orderDate: '2024-01-15',
    status: 'Completed',
    total: 1250.0
  },
  {
    id: 'ORD-002',
    orderNumber: 'ORD-002',
    orderDate: '2024-01-16',
    status: 'Processing',
    total: 890.5
  },
  {
    id: 'ORD-003',
    orderNumber: 'ORD-003',
    orderDate: '2024-01-17',
    status: 'Shipped',
    total: 450.75
  }
];

const childData = [
  {
    parentId: 'ORD-001',
    productName: 'Laptop Computer',
    quantity: 1,
    price: 999.0,
    category: 'Electronics'
  },
  {
    parentId: 'ORD-001',
    productName: 'Wireless Mouse',
    quantity: 2,
    price: 25.5,
    category: 'Accessories'
  },
  {
    parentId: 'ORD-001',
    productName: 'USB Cable',
    quantity: 3,
    price: 15.0,
    category: 'Accessories'
  },

  {
    parentId: 'ORD-002',
    productName: 'Office Chair',
    quantity: 1,
    price: 450.0,
    category: 'Furniture'
  },
  {
    parentId: 'ORD-002',
    productName: 'Desk Lamp',
    quantity: 2,
    price: 75.25,
    category: 'Lighting'
  },
  {
    parentId: 'ORD-002',
    productName: 'Notebook Set',
    quantity: 5,
    price: 12.0,
    category: 'Stationery'
  },

  {
    parentId: 'ORD-003',
    productName: 'Coffee Mug',
    quantity: 3,
    price: 18.25,
    category: 'Kitchenware'
  },
  {
    parentId: 'ORD-003',
    productName: 'Book Collection',
    quantity: 1,
    price: 89.99,
    category: 'Books'
  }
];

const setPCore = () => {
  (window as any).PCore = {
    getDataPageUtils: () => {
      return {
        getDataAsync: (dataPageName: string) => {
          if (dataPageName === 'D_Orders') {
            return Promise.resolve({
              data: parentData
            });
          }
          if (dataPageName === 'D_OrderItems') {
            return Promise.resolve({
              data: childData
            });
          }
          return Promise.resolve({ data: [] });
        }
      };
    },
    getLocaleUtils: () => {
      return {
        getLocaleValue: (key: string, category?: string) => {
          const translations: { [key: string]: string } = {
            'Loading content...': 'Loading content...',
            'No records available': 'No records available',
            'No related records found': 'No related records found'
          };
          return translations[key] || key;
        }
      };
    }
  };
};

type Story = StoryObj<typeof PegaExtensionsRepeatingView>;

export const Default: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getValue: (property: string) => {
            if (property === 'Orders') {
              return [
                {
                  id: 'ORD-001',
                  orderNumber: 'ORD-001',
                  orderDate: '2024-01-15',
                  status: 'Completed',
                  total: 1250.0,
                  items: [
                    {
                      productName: 'Laptop Computer',
                      quantity: 1,
                      price: 999.0,
                      category: 'Electronics'
                    },
                    {
                      productName: 'Wireless Mouse',
                      quantity: 2,
                      price: 25.5,
                      category: 'Accessories'
                    }
                  ]
                },
                {
                  id: 'ORD-002',
                  orderNumber: 'ORD-002',
                  orderDate: '2024-01-16',
                  status: 'Processing',
                  total: 890.5,
                  items: [
                    {
                      productName: 'Office Chair',
                      quantity: 1,
                      price: 450.0,
                      category: 'Furniture'
                    },
                    { productName: 'Desk Lamp', quantity: 2, price: 75.25, category: 'Lighting' }
                  ]
                }
              ];
            }
            return [];
          },
          createComponent: (viewItem: any) => {
            return <div key={viewItem.config?.name}>Target View: {viewItem.config?.name}</div>;
          }
        };
      }
    };
    return <PegaExtensionsRepeatingView {...props} />;
  },
  args: {
    source: 'datapage',
    parentDatapage: 'D_Orders',
    childDatapage: 'D_OrderItems',
    parentColumns: 'orderNumber,orderDate,status,total',
    childColumns: 'productName,quantity,price,category',
    parentKey: 'id',
    childKey: 'parentId'
  }
};

export const PropertyBased: Story = {
  render: args => {
    setPCore();
    const props = {
      ...args,
      getPConnect: () => {
        return {
          getValue: (property: string) => {
            if (property === 'Orders') {
              return [
                {
                  id: 'ORD-001',
                  orderNumber: 'ORD-001',
                  orderDate: '2024-01-15',
                  status: 'Completed',
                  total: 1250.0,
                  items: [
                    {
                      productName: 'Laptop Computer',
                      quantity: 1,
                      price: 999.0,
                      category: 'Electronics'
                    },
                    {
                      productName: 'Wireless Mouse',
                      quantity: 2,
                      price: 25.5,
                      category: 'Accessories'
                    }
                  ]
                },
                {
                  id: 'ORD-002',
                  orderNumber: 'ORD-002',
                  orderDate: '2024-01-16',
                  status: 'Processing',
                  total: 890.5,
                  items: [
                    {
                      productName: 'Office Chair',
                      quantity: 1,
                      price: 450.0,
                      category: 'Furniture'
                    },
                    { productName: 'Desk Lamp', quantity: 2, price: 75.25, category: 'Lighting' }
                  ]
                }
              ];
            }
            return [];
          },
          createComponent: (viewItem: any) => {
            return <div key={viewItem.config?.name}>Target View: {viewItem.config?.name}</div>;
          }
        };
      }
    };
    return <PegaExtensionsRepeatingView {...props} />;
  },
  args: {
    source: 'property',
    parentProperty: 'Orders',
    childProperty: 'items',
    parentColumns: 'orderNumber,orderDate,status,total',
    childColumns: 'productName,quantity,price,category',
    parentKey: 'id'
  }
};
