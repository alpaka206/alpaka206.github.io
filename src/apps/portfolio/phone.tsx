import type { PhoneAppProps } from '../registry';
import { ProjectScreen } from './phone-project';

/** One case study, opened from a Home Screen icon, a folder, Spotlight or a deep link. */
export default function PortfolioPhone({ props }: PhoneAppProps<'portfolio'>) {
  return <ProjectScreen slug={props.slug ?? ''} />;
}
