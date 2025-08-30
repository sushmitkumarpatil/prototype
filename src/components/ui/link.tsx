'use client';

import NextLink, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';

const Link = ({ href, children, className, ...props }: LinkProps & { children: React.ReactNode, className?: string }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    NProgress.start();
    router.push(href.toString());
  };

  return (
    <NextLink href={href} {...props} className={className} onClick={handleClick}>
      {children}
    </NextLink>
  );
};

export default Link;
