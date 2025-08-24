export function ProjectImg(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      {...props}
      className={[
        'rounded-[10px] shadow-[0_4px_8px_rgba(0,0,0,0.1)] my-2.5',
        'w-[90%] mx-auto md:w-[40%] md:mx-[5%]',
        props.className || '',
      ].join(' ')}
    />
  );
}
