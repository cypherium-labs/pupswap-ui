import React, { HTMLProps, useCallback } from "react";
import ReactGA from "react-ga";
import styled, { keyframes } from "styled-components";
import { darken } from "polished";
import { ArrowLeft, X } from "react-feather";
import Link from "next/link";

export const Button = styled.button<{ warning?: boolean }>`
  padding: 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  width: 100%;
  background-color: ${({ warning, theme }) =>
    warning ? theme.red1 : theme.primary1};
  color: ${({ theme }) => theme.white};

  :hover,
  :focus {
    background-color: ${({ warning, theme }) =>
      darken(0.05, warning ? theme.red1 : theme.primary1)};
  }

  :active {
    background-color: ${({ warning, theme }) =>
      darken(0.1, warning ? theme.red1 : theme.primary1)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text4};
    cursor: auto;
  }
`;

export const CloseIcon = styled(X)`
  cursor: pointer;
`;

// Button that looks like a link
export const LinkStyledButton = styled.button<{ disabled?: boolean }>`
  border: none;
  text-decoration: none;
  background: none;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  color: ${({ theme, disabled }) => (disabled ? theme.text2 : theme.primary1)};
  font-weight: 500;

  :hover {
    text-decoration: ${({ disabled }) => (disabled ? "none" : "underline")};
  }

  :focus {
    outline: none;
    text-decoration: ${({ disabled }) => (disabled ? "none" : "underline")};
  }

  :active {
    text-decoration: none;
  }
`;

// Internal Next.js Link styled properly
export const StyledInternalLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} passHref>
    <StyledLink>{children}</StyledLink>
  </Link>
);

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`;

/**
 * Outbound link that handles firing Google Analytics events
 */
export function ExternalLink({
  target = "_blank",
  href,
  rel = "noopener noreferrer",
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, "as" | "ref" | "onClick"> & {
  href: string;
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (target === "_blank" || event.ctrlKey || event.metaKey) {
        ReactGA.outboundLink({ label: href }, () => {
          console.debug("Fired outbound link event", href);
        });
      } else {
        event.preventDefault();
        ReactGA.outboundLink({ label: href }, () => {
          window.location.href = href;
        });
      }
    },
    [href, target]
  );

  return (
    <StyledLink
      target={target}
      rel={rel}
      href={href}
      onClick={handleClick}
      {...rest}
    />
  );
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.img`
  animation: 2s ${rotate} linear infinite;
  width: 16px;
  height: 16px;
`;

const BackArrowLink = styled(StyledLink)`
  color: ${({ theme }) => theme.text1};
`;

export function BackArrow({ to }: { to: string }) {
  return (
    <StyledInternalLink href={to}>
      <BackArrowLink>
        <ArrowLeft />
      </BackArrowLink>
    </StyledInternalLink>
  );
}
