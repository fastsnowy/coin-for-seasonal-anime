import { Alert, AlertDescription } from "@/components/ui/alert";
import { BlurText } from "@/components/ui/blur-text";
import { CircleAlert, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared calm, centered card used by the login and account-link screens.
 */
export function AuthCard({
  title,
  description,
  error,
  benefits,
  children,
  footer,
}: {
  title: string;
  description: string;
  error?: string;
  benefits: { icon: LucideIcon; text: string }[];
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section
      aria-labelledby="auth-card-title"
      className="surface mt-4 overflow-hidden rounded-2xl animate-scale-in"
    >
      <div className="relative px-5 pt-8 pb-6 sm:px-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_at_top,var(--coin-muted)_0%,transparent_70%)]"
        />
        <div className="relative flex flex-col items-center text-center">
          <span
            aria-hidden="true"
            className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-coin/20 bg-coin-muted text-xl shadow-xs"
          >
            🪙
          </span>
          <BlurText
            as="h1"
            id="auth-card-title"
            text={title}
            className="text-2xl font-extrabold tracking-tight text-balance"
          />
          <p className="mt-2 max-w-[32ch] text-sm leading-relaxed text-muted-foreground text-pretty">
            {description}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="relative mt-6">
            <CircleAlert aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative mt-6">{children}</div>

        <ul className="relative mt-6 space-y-2.5">
          {benefits.map(({ icon: BenefitIcon, text }) => (
            <li
              key={text}
              className="flex items-start gap-2.5 text-[13px] leading-relaxed text-muted-foreground"
            >
              <BenefitIcon
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-coin-foreground"
              />
              <span>{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {footer && (
        <div className="border-t border-border bg-surface-sunken px-5 py-4 sm:px-8">
          {footer}
        </div>
      )}
    </section>
  );
}

/** Secondary hint + link shown in the card footer. */
export function AuthFooterLink({
  description,
  href,
  label,
  icon: FooterIcon,
}: {
  description: string;
  href: string;
  label: string;
  icon: LucideIcon;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Link
        href={href}
        className="-mx-1 inline-flex min-h-10 items-center gap-1.5 rounded-md px-1 text-sm font-medium text-coin-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/35"
      >
        <FooterIcon aria-hidden="true" className="size-4" />
        {label}
      </Link>
    </div>
  );
}
