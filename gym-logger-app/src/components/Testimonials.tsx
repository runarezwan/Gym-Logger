export default function Testimonials() {
  return (
    <section id="testimonials" className="container py-8 md:py-12 lg:py-24">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">What our users say</h2>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 pt-8">
        {[
          { name: "Alex P.", review: "This app revolutionized my workout tracking. It's clean and extremely fast." },
          { name: "Jamie L.", review: "Finally, a gym app that doesn't get in the way of my actual lifting. Highly recommended!" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col justify-between rounded-lg border bg-background p-6 shadow-sm">
            <p className="text-muted-foreground italic">"{item.review}"</p>
            <div className="mt-4 font-semibold">- {item.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
