import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as DemoStories from './demo.stories';

const { Default, PropertyBased } = composeStories(DemoStories);

describe('PegaExtensionsRepeatingView', () => {
  test('renders repeating view with default data page source', async () => {
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText(/orderNumber: ORD-001/)).toBeVisible();
    });
    expect(screen.getByText(/orderNumber: ORD-002/)).toBeVisible();
    expect(screen.getByText(/orderNumber: ORD-003/)).toBeVisible();
  });

  test('expands and collapses parent records', async () => {
    render(<Default />);

    await waitFor(() => {
      expect(screen.getByText(/orderNumber: ORD-001/)).toBeVisible();
    });

    const expandButton = screen.getByRole('button', { name: /orderNumber: ORD-001/ });
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(expandButton);

    expect(expandButton).toHaveAttribute('aria-expanded', 'true');

    await waitFor(() => {
      expect(screen.getByText('Laptop Computer')).toBeVisible();
    });
    expect(screen.getByText('Wireless Mouse')).toBeVisible();
  });

  test('renders property-based source correctly', async () => {
    render(<PropertyBased />);

    await waitFor(() => {
      expect(screen.getByText(/orderNumber: ORD-001/)).toBeVisible();
    });
    expect(screen.getByText(/orderNumber: ORD-002/)).toBeVisible();
  });

  test('shows no records message when no data available', async () => {
    const EmptyComponent = () => {
      (window as any).PCore = {
        getDataPageUtils: () => ({
          getDataAsync: () => Promise.resolve({ data: [] })
        }),
        getLocaleUtils: () => ({
          getLocaleValue: (key: string) => key
        })
      };

      return <Default parentDatapage='D_EmptyOrders' childDatapage='D_EmptyOrderItems' />;
    };

    render(<EmptyComponent />);

    await waitFor(() => {
      expect(screen.getByText('No records available')).toBeVisible();
    });
  });

  test('shows loading state initially', async () => {
    (window as any).PCore = {
      getDataPageUtils: () => ({
        getDataAsync: () =>
          new Promise(resolve => {
            setTimeout(() => resolve({ data: [] }), 100);
          })
      }),
      getLocaleUtils: () => ({
        getLocaleValue: (key: string) => key
      })
    };

    render(<Default />);

    expect(screen.getByText('Loading content...')).toBeVisible();

    await waitFor(
      () => {
        expect(screen.queryByText('Loading content...')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});
