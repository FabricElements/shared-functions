/**
 * @license
 * Copyright FabricElements. All Rights Reserved.
 */

/**
 * User interface
 */
export interface InterfaceUser {
  displayName?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  metadata?: any;
  providerData?: any;
  photoURL?: string | null;
  disabled?: boolean;
  phoneNumber?: string | null;
  uid?: string;
}
