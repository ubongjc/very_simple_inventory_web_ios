/**
 * Custom React hooks for the Rental Inventory application
 * @module hooks
 */

export { useBookings } from './useBookings';
export type { Booking, UseBookingsOptions, UseBookingsReturn } from './useBookings';

export { useItems } from './useItems';
export type { Item, UseItemsReturn } from './useItems';

export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsTouchDevice,
} from './useMediaQuery';
