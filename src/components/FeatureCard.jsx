export default function FeatureCard({ title, desc, cta, image }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <img src={image} className="h-52 w-full object-cover" />
      <div className="p-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{desc}</p>
        <button className="mt-4 text-sm font-medium text-emerald-600">
          {cta} →
        </button>
      </div>
    </div>
  );
}
