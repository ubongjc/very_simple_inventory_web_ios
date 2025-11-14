import { useEffect, useState } from 'react';

export interface AppSettings {
  currency: string;
  currencySymbol: string;
  currencyCode: 'NGN' | 'USD' | 'GBP' | 'EUR';
  timezone: string;
  dateFormat: string;
  lowStockThreshold: number;
  defaultBookingDays: number;
  businessName: string;
  taxRate: number | null;
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: 'Nigerian Naira',
  currencySymbol: '₦',
  currencyCode: 'NGN',
  timezone: 'Africa/Lagos',
  dateFormat: 'DD/MM/YYYY',
  lowStockThreshold: 5,
  defaultBookingDays: 1,
  businessName: 'My Rental Business',
  taxRate: null,
};

/**
 * Hook to access application settings with Nigerian defaults
 * Falls back to server settings if available, otherwise uses Nigerian defaults
 */
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings({
            currency: data.currency === 'NGN' ? 'Nigerian Naira' : data.currency,
            currencySymbol: data.currencySymbol,
            currencyCode: data.currency,
            timezone: data.timezone || 'Africa/Lagos',
            dateFormat: data.dateFormat || 'DD/MM/YYYY',
            lowStockThreshold: data.lowStockThreshold || 5,
            defaultBookingDays: data.defaultRentalDays || 1,
            businessName: data.businessName,
            taxRate: data.taxRate,
          });
        } else {
          // Use Nigerian defaults if settings fetch fails
          setSettings(DEFAULT_SETTINGS);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  /**
   * Format currency amount according to Nigerian standards
   * @param amount - The amount to format
   * @param includeSymbol - Whether to include the currency symbol
   */
  const formatCurrency = (amount: number, includeSymbol = true): string => {
    const formatted = new Intl.NumberFormat('en-NG', {
      style: includeSymbol ? 'currency' : 'decimal',
      currency: settings.currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return formatted;
  };

  /**
   * Format date according to Nigerian/user preferences
   * @param date - The date to format
   */
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('en-NG', {
      timeZone: settings.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(dateObj);
  };

  /**
   * Format date and time according to Nigerian/user preferences
   * @param date - The date to format
   */
  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    return new Intl.DateTimeFormat('en-NG', {
      timeZone: settings.timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(dateObj);
  };

  return {
    settings,
    loading,
    formatCurrency,
    formatDate,
    formatDateTime,
    // Convenience getters
    get currencySymbol() {
      return settings.currencySymbol;
    },
    get currencyCode() {
      return settings.currencyCode;
    },
    get timezone() {
      return settings.timezone;
    },
  };
}
