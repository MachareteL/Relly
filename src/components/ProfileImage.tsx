export function ProfileImage({ src, className }: ProfileImageProps) {
  return (
    <div className={`overflow-hidden rounded-full ${className}`}>
      {src == null ? (
        <img src="https://via.placeholder.com/150" className="h-full w-full" />
      ) : (
        <img src={src} alt="Profile Image" />
      )}
    </div>
  );
}
