export function GitHubLink({ url }: { url: string }) {
  const open = () => {
    const popupWidth = 1200;
    const popupHeight = 600;
    const popupX = Math.round(
      window.screenX + window.outerWidth / 2 - popupWidth / 2
    );
    const popupY = Math.round(
      window.screenY + window.outerHeight / 2 - popupHeight / 2
    );
    const featureWindow = `width=${popupWidth}, height=${popupHeight}, left=${popupX}, top=${popupY}`;
    window.open(url, '_blank', featureWindow);
  };

  return (
    <button
      onClick={open}
      className='text-blue-600 underline underline-offset-2 hover:opacity-80'
    >
      {url}
    </button>
  );
}
