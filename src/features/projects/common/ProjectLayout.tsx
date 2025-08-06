type FieldRowProps = {
  label: string;
  children: React.ReactNode;
};

export function ProjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full px-5 py-5 leading-relaxed text-[#333] bg-[#f9f9f9]'>
      {children}
    </div>
  );
}

export function FieldRow({ label, children }: FieldRowProps) {
  return (
    <div className='flex my-4 gap-4'>
      <div className='text-lg font-semibold text-[#555] min-w-[25%] md:w-[15%]'>
        {label}
      </div>
      <div className='min-w-0'>{children}</div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className='text-2xl font-extrabold mb-2 text-black'>{children}</h2>
  );
}

export function Divider() {
  return <hr className='w-full h-px bg-gray-300 border-0 my-2.5' />;
}
