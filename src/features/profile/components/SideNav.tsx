import { Link } from 'react-scroll';
import { NAV_ITEMS, SCROLL_OFFSET } from '../data/nav';

const SCROLL_CONTAINER_ID = 'pages-scroll-container';

export function SideNav() {
  return (
    <nav className='hidden md:flex w-[120px] bg-transparent py-[60px] pl-6 pr-0 flex-col gap-4'>
      {NAV_ITEMS.map(({ name, target }) => (
        <Link
          key={target}
          to={target}
          smooth
          duration={500}
          offset={SCROLL_OFFSET}
          containerId={SCROLL_CONTAINER_ID}
        >
          <div className='text-[15px] font-semibold text-[#444] hover:text-[#007aff] cursor-pointer'>
            {name}
          </div>
        </Link>
      ))}
    </nav>
  );
}
