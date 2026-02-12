import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';

type SafeMarkdownProps = {
  children: string;
  className?: string;
  assetBaseUrl?: string;
};

const isAbsoluteUrl = (value: string) => /^([a-z][a-z0-9+.-]*:)?\/\//i.test(value);

const normalizeAssetUrl = (url: string, assetBaseUrl?: string) => {
  const src = String(url || '').trim();
  if (!src) return src;

  // Allow common safe schemes.
  if (
    isAbsoluteUrl(src) ||
    src.startsWith('data:') ||
    src.startsWith('blob:') ||
    src.startsWith('/') ||
    src.startsWith('#') ||
    src.startsWith('mailto:') ||
    src.startsWith('tel:')
  ) {
    return src;
  }

  if (!assetBaseUrl) return src;
  const base = String(assetBaseUrl).trim().replace(/\/$/, '');
  const rel = src.replace(/^\.\//, '');
  return `${base}/${rel}`;
};

const isVideoUrl = (src: string) => /\.(mp4|webm|mov|m4v|ogg)(\?.*)?$/i.test(src);

const sanitizeSchema = {
  ...defaultSchema,
  tagNames: Array.from(
    new Set([...(defaultSchema.tagNames || []), 'video', 'source'])
  ),
  attributes: {
    ...(defaultSchema.attributes || {}),
    img: Array.from(
      new Set([
        ...(((defaultSchema.attributes as any)?.img as string[]) || []),
        'className',
        'loading',
        'decoding',
        'referrerPolicy',
      ])
    ),
    video: [
      'src',
      'className',
      'controls',
      'muted',
      'loop',
      'playsInline',
      'playsinline',
      'autoPlay',
      'autoplay',
      'poster',
      'preload',
    ],
    source: ['src', 'type'],
    a: Array.from(
      new Set([
        ...(((defaultSchema.attributes as any)?.a as string[]) || []),
        'className',
        'target',
        'rel',
      ])
    ),
  },
  protocols: {
    ...(defaultSchema.protocols || {}),
    src: ['http', 'https', 'data', 'blob'],
    href: ['http', 'https', 'mailto', 'tel'],
  },
};

export const SafeMarkdown: React.FC<SafeMarkdownProps> = ({ children, className, assetBaseUrl }) => {
  const transformUri = (uri: string) => normalizeAssetUrl(uri, assetBaseUrl);

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          // Allows embedded HTML like <video> while still sanitizing.
          rehypeRaw,
          [rehypeSanitize, sanitizeSchema as any],
        ]}
        urlTransform={transformUri}
        components={{
          img: ({ src, alt, ...props }) => {
            const safeSrc = normalizeAssetUrl(String(src || ''), assetBaseUrl);
            if (safeSrc && isVideoUrl(safeSrc)) {
              return (
                <video
                  className="w-full max-w-full rounded-xl border border-white/10 bg-black/40"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src={safeSrc} />
                  <a href={safeSrc} className="text-sky-300 underline">Open video</a>
                </video>
              );
            }

            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={safeSrc}
                alt={alt || ''}
                loading="lazy"
                decoding="async"
                className="max-w-full h-auto rounded-xl border border-white/10 bg-black/20"
                {...props}
              />
            );
          },
          a: ({ href, children: linkChildren, ...props }) => {
            const safeHref = normalizeAssetUrl(String(href || ''), assetBaseUrl);
            if (safeHref && isVideoUrl(safeHref)) {
              return (
                <div className="my-3">
                  <video
                    className="w-full max-w-full rounded-xl border border-white/10 bg-black/40"
                    controls
                    playsInline
                    preload="metadata"
                  >
                    <source src={safeHref} />
                    <a href={safeHref} className="text-sky-300 underline">Open video</a>
                  </video>
                </div>
              );
            }

            const isExternal = safeHref && isAbsoluteUrl(safeHref);
            return (
              <a
                href={safeHref}
                className="text-sky-300 underline underline-offset-4 hover:text-sky-200"
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer noopener' : undefined}
                {...props}
              >
                {linkChildren}
              </a>
            );
          },
          video: ({ children: videoChildren, ...props }) => (
            <video
              className="w-full max-w-full rounded-xl border border-white/10 bg-black/40"
              controls
              playsInline
              preload="metadata"
              {...props}
            >
              {videoChildren}
            </video>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
