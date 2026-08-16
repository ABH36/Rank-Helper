import Container from './Container'

export default function Section({
  id,
  eyebrow,
  title,
  subtitle,
  className = '',
  containerClassName = '',
  children,
}) {
  return (
    <section id={id} className={`py-16 sm:py-24 ${className}`}>
      <Container className={containerClassName}>
        {(eyebrow || title || subtitle) && (
          <div className="mx-auto mb-14 max-w-3xl text-center">
            {eyebrow && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-normal tracking-wider text-primary uppercase backdrop-blur-md">
                {eyebrow}
              </span>
            )}
            {title && (
              <h2 className="font-heading text-3xl font-normal tracking-tight text-text sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-4 text-base text-text-muted sm:text-lg leading-relaxed">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

