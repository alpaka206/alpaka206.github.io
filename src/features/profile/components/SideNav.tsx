import { Link } from 'react-scroll';
import { NAV_ITEMS, SCROLL_OFFSET } from '../data/nav';

export function SideNav() {
  return (
    <nav className='hidden md:flex fixed top-0 left-0 h-screen w-[120px] border-r border-[#e5e5e5] bg-white py-[60px] pl-6 pr-0 flex-col gap-4'>
      {NAV_ITEMS.map(({ name, target }) => (
        <Link
          key={target}
          to={target}
          smooth
          duration={500}
          offset={SCROLL_OFFSET}
        >
          <div className='text-[15px] font-semibold text-[#444] hover:text-[#007aff] cursor-pointer'>
            {name}
          </div>
        </Link>
      ))}
    </nav>
  );
}
