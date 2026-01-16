export default function RecentScanCard({ name, image }) {
  return (
    <div>
      <div className="h-40 w-40 rounded-xl overflow-hidden bg-gray-100">
        <img src={image} className="h-full w-full object-cover" />
      </div>
      <p className="mt-2 text-sm font-medium text-gray-700">{name}</p>
    </div>
  );
}
