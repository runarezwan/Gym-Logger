export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 max-w-[800px] px-4">
      <h1 className="text-4xl font-bold mb-8">About Gym Logger</h1>
      <div className="prose prose-lg dark:prose-invert">
        <p>
          Gym Logger is a premium progressive web application designed for serious lifters
          who want to track their progress meticulously without the clutter of social features
          or unnecessary distractions.
        </p>
        <p className="mt-4">
          Our mission is to provide the fastest, most reliable way to log sets, reps, and
          weights while offering intelligent insights into your lifting journey.
        </p>
      </div>
    </div>
  );
}
