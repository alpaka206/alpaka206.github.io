import { copyEmail, openTextVersion, toggleDarkMode } from '@/os/actions';
import { registerCommands } from '@/os/commands';
import { usePhoneNav } from './nav';

/**
 * The phone's handlers for the shared command ids (Spotlight results and
 * Messages attachments run commands by id). The desktop registers its own
 * versions; only one shell is ever mounted.
 */
export function registerPhoneCommands() {
  return registerCommands({
    'system.copyEmail': () => void copyEmail('메일'),
    'system.readerMode': openTextVersion,
    'system.toggleDarkMode': toggleDarkMode,
    'open.portfolioPdf': () => usePhoneNav.getState().open('preview'),
  });
}
