import { create } from 'zustand';

/** The message being written. It outlives the window or sheet, as Mail keeps an unsent draft. */
export const useDraft = create(() => ({ subject: '', body: '' }));

/** Mail opened with a subject (the terminal's `sudo hire-me`) fills it in over whatever was there. */
export const prefillSubject = (subject: string | undefined) => {
  if (subject) useDraft.setState({ subject });
};
