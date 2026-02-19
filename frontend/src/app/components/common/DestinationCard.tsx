interface DestinationCardProps {
  image: string;
  name: string;
  price: string;
  onClick?: () => void;
}

export function DestinationCard({ image, name, price, onClick }: DestinationCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative overflow-hidden rounded-2xl aspect-[4/5] w-full hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-2xl"
    >
      <img
        src={image}
        alt={name}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-left text-white">
        <h3 className="text-2xl mb-1">{name}</h3>
        <p className="text-lg text-white/90">from {price}</p>
      </div>
      <div className="absolute inset-0 border-2 border-white/0 group-hover:border-white/50 transition-colors rounded-2xl" />
    </button>
  );
}
