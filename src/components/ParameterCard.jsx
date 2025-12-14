import { useState } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ParameterCard = ({
  icon, // URL de l'icône (votre ancienne méthode)
  label,
  value,
  unit,
  gradientFrom,
  gradientTo,
  trend, // "up", "down", "stable" (optionnel)
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Détermine l'icône de tendance
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-white/90" : trend === "down" ? "text-white/90" : "text-white/60";

  return (
    <div
      className="relative rounded-2xl shadow-xl hover:shadow-2xl px-6 py-7 w-full text-center transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer overflow-hidden group"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glassmorphism overlay on hover */}
      <div className={`absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      
      {/* Animated background circles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/30 rounded-full blur-2xl transition-transform duration-700" 
          style={{ transform: isHovered ? 'scale(1.5)' : 'scale(1)' }} />
        <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white/20 rounded-full blur-2xl transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.5)' : 'scale(1)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon with animation */}
        <div className="mb-4 flex justify-center">
          <div className={`transition-all duration-500 ${isHovered ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <img 
                src={icon} 
                alt={label} 
                className="h-10 w-10 drop-shadow-xl filter brightness-0 invert" 
              />
            </div>
          </div>
        </div>

        {/* Value + Unit with scale animation */}
        <div className={`transition-transform duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}>
          <div className="text-4xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg">
            {value}
            {unit && (
              <span className="text-xl md:text-2xl font-bold ml-2 text-white/90">{unit}</span>
            )}
          </div>
        </div>

        {/* Label */}
        <p className="text-sm md:text-base font-bold text-white/95 mt-3 uppercase tracking-wider drop-shadow-md">
          {label}
        </p>

        {/* Trend indicator (optional) */}
        {trend && (
          <div className={`mt-4 flex items-center justify-center gap-1.5 ${trendColor} transition-all duration-300 ${isHovered ? 'opacity-100 scale-105' : 'opacity-80'}`}>
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <TrendIcon className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-xs font-bold">
                {trend === "up" ? "Rising" : trend === "down" ? "Falling" : "Stable"}
              </span>
            </div>
          </div>
        )}

        {/* Bottom shine effect */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
      </div>

      {/* Corner glow */}
      <div className="absolute -top-2 -right-2 w-24 h-24 bg-white/30 rounded-full blur-3xl transition-all duration-500"
        style={{ 
          transform: isHovered ? 'scale(1.5)' : 'scale(0)',
          opacity: isHovered ? 1 : 0 
        }} />
    </div>
  );
};

export default ParameterCard;