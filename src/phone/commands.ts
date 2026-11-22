import { PROFILE } from '@/content/profile';
import { copyEmail, openTextVersion, toggleDarkMode } from '@/os/actions';
import { registerCommands, runCommand } from '@/os/commands';
import type { SearchTarget } from '@/os/search';
import { usePhoneNav, type LaunchOrigin } from './nav';

export const openPdf = () => window.open(PROFILE.portfolioPdf, '_blank', 'noopener');

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

/** Runs a Spotlight result: opens an app (zooming out of `from`), runs a command or follows a link. */
export function runTarget(target: SearchTarget, from: LaunchOrigin | null) {
  if (target.type === 'open') usePhoneNav.getState().open(target.app, target.props ?? {}, from);
  else if (target.type === 'command') runCommand(target.command);
  else window.open(target.href, '_blank', 'noopener');
}
