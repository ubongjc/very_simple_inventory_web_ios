import { useState, useEffect, useCallback } from 'react';

export interface Booking {
  id: string;
  customerId: string;
  startDate: string;
  endDate: string;
  status: string;
  customer: {
    firstName: string;
    lastName?: string;
    name: string;
  };
  items: Array<{
    itemId: string;
    quantity: number;
    item: {
      name: string;
    };
  }>;
  color?: string;
}

export interface UseBookingsOptions {
  start?: string;
  end?: string;
  autoFetch?: boolean;
}

export interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch and manage bookings
 * @param options - Configuration options for fetching bookings
 * @returns Bookings data, loading state, error state, and refetch function
 */
export function useBookings(options: UseBookingsOptions = {}): UseBookingsReturn {
  const { start, end, autoFetch = true } = options;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (start) {
        params.append('start', start);
      }
      if (end) {
        params.append('end', end);
      }

      const response = await fetch(`/api/bookings?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch bookings: ${response.statusText}`);
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [start, end]);

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [autoFetch, fetchBookings]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
  };
}
