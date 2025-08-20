// src/pages/Contact.jsx
export default function Contact({ data, canEdit, onEdit }) {
  return (
    <main className="pt-20 max-w-4xl mx-auto px-4 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h1 className="text-3xl font-bold">{data.title}</h1>
        {canEdit && (
          <button
            onClick={onEdit}
            className="rounded border px-3 py-1 hover:bg-black/5"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <p className="font-semibold">Email</p>
          <p className="text-gray-700">{data.email}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="font-semibold">Phone</p>
          <p className="text-gray-700">{data.phone}</p>
        </div>
        <div className="sm:col-span-2 rounded-lg border p-4">
          <p className="font-semibold">Address</p>
          <p className="text-gray-700">{data.address}</p>
        </div>
      </div>

      {data.note && (
        <div className="rounded-lg border p-4">
          <p className="font-semibold">More info</p>
          <p className="text-gray-700 whitespace-pre-line">{data.note}</p>
        </div>
      )}
    </main>
  );
}
