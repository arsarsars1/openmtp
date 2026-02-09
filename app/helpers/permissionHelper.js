/**
 * Permission Helper Module
 * Handles macOS Full Disk Access permission checks and requests
 */

import macosVersion from 'macos-version';
import { NODE_MAC_PERMISSIONS_MIN_OS } from '../constants';

/**
 * Check if the current macOS version supports node-mac-permissions
 * @returns {boolean}
 */
export const isPermissionCheckSupported = () => {
  return macosVersion.isGreaterThanOrEqualTo(NODE_MAC_PERMISSIONS_MIN_OS);
};

/**
 * Check if Full Disk Access permission is granted
 * @returns {Promise<'authorized' | 'denied' | 'not determined' | 'restricted' | 'unsupported'>}
 */
export const checkFullDiskAccess = async () => {
  if (!isPermissionCheckSupported()) {
    return 'unsupported';
  }

  try {
    const { getAuthStatus } = await import('node-mac-permissions');
    const status = getAuthStatus('full-disk-access');
    return status;
  } catch (error) {
    console.error('Failed to check Full Disk Access status:', error);
    return 'denied';
  }
};

/**
 * Check if Full Disk Access is authorized
 * @returns {Promise<boolean>}
 */
export const isFullDiskAccessAuthorized = async () => {
  const status = await checkFullDiskAccess();
  return status === 'authorized' || status === 'unsupported';
};

/**
 * Open System Preferences to Full Disk Access panel
 * This allows users to grant the permission manually
 */
export const openFullDiskAccessPreferences = async () => {
  if (!isPermissionCheckSupported()) {
    return;
  }

  try {
    const { askForFullDiskAccess } = await import('node-mac-permissions');
    askForFullDiskAccess();
  } catch (error) {
    console.error('Failed to open Full Disk Access preferences:', error);
  }
};

/**
 * Get a user-friendly message based on permission status
 * @param {string} status - The permission status
 * @returns {object} - Object with title and message
 */
export const getPermissionMessage = (status) => {
  switch (status) {
    case 'denied':
      return {
        title: 'Full Disk Access Required',
        message:
          'OpenMTP needs Full Disk Access to read and write files on your computer. Please grant permission in System Preferences to use all features.',
        showButton: true,
      };
    case 'not determined':
      return {
        title: 'Permission Required',
        message:
          'OpenMTP needs permission to access files on your computer. Please grant Full Disk Access to use all features.',
        showButton: true,
      };
    case 'restricted':
      return {
        title: 'Access Restricted',
        message:
          'Full Disk Access is restricted on this device. Please contact your system administrator.',
        showButton: false,
      };
    default:
      return null;
  }
};

/**
 * Check if specific folder access is granted
 * @param {'desktop' | 'documents' | 'downloads' | 'music' | 'pictures'} folder
 * @returns {Promise<'authorized' | 'denied' | 'not determined' | 'restricted' | 'unsupported'>}
 */
export const checkFolderAccess = async (folder) => {
  if (!isPermissionCheckSupported()) {
    return 'unsupported';
  }

  try {
    const { getAuthStatus } = await import('node-mac-permissions');
    return getAuthStatus(folder);
  } catch (error) {
    console.error(`Failed to check ${folder} access status:`, error);
    return 'denied';
  }
};

/**
 * Ask for specific folder access
 * @param {'desktop' | 'documents' | 'downloads' | 'music' | 'pictures'} folder
 * @returns {Promise<'authorized' | 'denied' | 'not determined' | 'restricted' | 'unsupported'>}
 */
export const askForFolderAccess = async (folder) => {
  if (!isPermissionCheckSupported()) {
    return 'unsupported';
  }

  try {
    const { askForFoldersAccess, askForPhotosAccess } = await import(
      'node-mac-permissions'
    );

    if (folder === 'pictures') {
      return askForPhotosAccess();
    }
    
    // node-mac-permissions askForFoldersAccess returns a promise that resolves to the status
    return askForFoldersAccess(folder);
  } catch (error) {
    console.error(`Failed to ask for ${folder} access:`, error);
    return 'denied';
  }
};
