/** A line that is nothing but a web address ("github.com/alpaka206/…") is a link, as Notes detects them. */
const WEB_ADDRESS = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i;

/** One line of a note body, in either shell: the text, or a link when it is a web address. */
export function NoteLine({ text }: { text: string }) {
  if (!WEB_ADDRESS.test(text)) return text;
  return (
    <a href={/^https?:\/\//i.test(text) ? text : `https://${text}`} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
}
