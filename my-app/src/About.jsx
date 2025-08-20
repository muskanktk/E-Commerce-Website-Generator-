// src/pages/About.jsx
export default function About({ data, canEdit, onEdit }) {
  return (
    <main className="pt-20 max-w-4xl mx-auto px-4">
      {data.image && (
        <img
          src={data.image}
          alt="About banner"
          className="w-full rounded-xl shadow mb-6 object-cover"
        />
      )}
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
      <p className="mt-4 whitespace-pre-line leading-7">{data.body}</p>
    </main>
  );
}
