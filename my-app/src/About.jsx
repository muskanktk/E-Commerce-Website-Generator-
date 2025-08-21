export default function About({ data, canEdit, onEdit }) {
  const { title = "About Us", body = "", image = "" } = data || {};

  return (
    <main className="pt-20 mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-extrabold tracking-wide font-serif">{title}</h1>
        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border px-3 py-1 hover:bg-black/5"
            title="Edit About"
          >
            Edit
          </button>
        )}
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: text */}
        <div className="order-2 md:order-1">
          <div className="prose max-w-none">
            {body ? (
              <p className="whitespace-pre-wrap leading-7">{body}</p>
            ) : (
              <p className="text-gray-600">
                Write about your brand, story, materials, and care instructions.
              </p>
            )}
          </div>
        </div>

        {/* Right: smaller image */}
        <div className="order-1 md:order-2 flex md:justify-end">
          <img
            src={image || "https://via.placeholder.com/1000x600?text=About+Banner"}
            alt="About banner"
            className="w-full max-w-sm h-auto object-cover rounded-lg shadow"
            loading="lazy"
            decoding="async"
            width="640"
            height="400"
          />
        </div>
      </section>
    </main>
  );
}
