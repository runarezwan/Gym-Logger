export default function Hero() {
  return (
    <section className="space-y-6 pb-8 pt-16 md:pb-12 md:pt-24 lg:pb-32 lg:pt-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          Track your workouts with precision
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          The ultimate gym logging application. Built for serious lifters who want to track every rep, set, and session with ease.
        </p>
        <div className="space-x-4">
          <a href="/login" className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Get Started
          </a>
          <a href="/about" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
}
