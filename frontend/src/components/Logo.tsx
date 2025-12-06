const Logo = () => {
  return (
    <div className="flex items-center gap-3">

      {/* Responsive Owl Image */}
      <div className="flex-shrink-0">
        <img
          src="/images/owl_logo.webp"
          alt="Owl logo"
          className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain"
        />
      </div>

      {/* Text */}
      <div className="leading-tight">
        <h1 className="text-accent logo-title text-lg sm:text-xl lg:text-2xl font-bold">
          Podcastic
        </h1>

        <h2 className="text-xs sm:text-sm text-text-secondary tracking-wide">
          listen smarter
        </h2>
      </div>
    </div>
  );
};

export default Logo;
