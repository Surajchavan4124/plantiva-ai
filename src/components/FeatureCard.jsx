export default function FeatureCard({
  title,
  desc,
  cta,
  image,
  onClick,
}) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-md">
      {/* Image */}
      <img
        src={image}
        alt={title}
        className="h-52 w-full object-cover"
      />

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-sm text-gray-600">
          {desc}
        </p>

        {/* CTA */}
        <button
          onClick={onClick}
          className="mt-4 inline-flex items-center text-sm font-medium text-emerald-600 hover:underline"
        >
          {cta}
          <span className="ml-1">→</span>
        </button>
      </div>
    </div>
  );
}
