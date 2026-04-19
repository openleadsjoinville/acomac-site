type IconProps = { size?: number; className?: string };

export function WhatsAppIcon({ size = 20, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M16 .4C7.4.4.4 7.4.4 16c0 2.8.8 5.6 2.2 8L.2 31.6l7.8-2.4c2.3 1.2 4.9 1.9 7.6 1.9h.3C24.4 31 31.4 24 31.4 15.4 31.4 11.3 29.8 7.5 26.9 4.6 24 1.7 20.1.4 16 .4zm0 28.3c-2.5 0-4.9-.7-7-2l-.5-.3-4.6 1.4 1.4-4.5-.3-.5c-1.4-2.3-2.2-4.8-2.2-7.5 0-7 5.7-12.7 12.7-12.7 3.4 0 6.6 1.3 9 3.7 2.4 2.4 3.7 5.6 3.7 9C28.7 23.5 23 28.7 16 28.7zm7-9.2c-.4-.2-2.3-1.1-2.6-1.3-.3-.1-.6-.2-.8.2-.2.4-.9 1.2-1.1 1.4-.2.2-.4.2-.8 0-.4-.2-1.7-.6-3.2-1.9-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.3 0-.5-.1-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.5-.3.4-1.2 1.2-1.2 3s1.2 3.5 1.4 3.7c.2.3 2.4 3.6 5.8 5.1.8.3 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 2.3-.9 2.6-1.9.3-.9.3-1.7.2-1.9-.1-.2-.3-.3-.7-.5z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, className }: IconProps) {
  const id = "ig-gradient";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="5" fill={`url(#${id})`} />
      <rect
        x="5"
        y="5"
        width="14"
        height="14"
        rx="3.5"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="#fff" />
    </svg>
  );
}
