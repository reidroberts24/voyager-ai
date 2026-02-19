interface PhotoCollageProps {
  images: string[];
}

export function PhotoCollage({ images }: PhotoCollageProps) {
  return (
    <div className="hidden lg:flex relative h-full bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
      {/* Grid of photos */}
      <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
        {images.map((image, idx) => (
          <div
            key={idx}
            className={`relative overflow-hidden rounded-2xl ${
              idx === 0 ? 'col-span-2 row-span-2' : ''
            }`}
          >
            <img
              src={image}
              alt={`Travel destination ${idx + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 flex items-end p-12">
        <div className="text-white">
          <h1 className="text-4xl font-medium mb-3">Start Your Journey</h1>
          <p className="text-lg text-white/90">
            Plan your perfect trip with AI-powered recommendations
          </p>
        </div>
      </div>
    </div>
  );
}
