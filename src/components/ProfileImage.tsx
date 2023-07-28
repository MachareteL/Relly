export function ProfileImage({ src, className }: ProfileImageProps) {
  return (
    <div className={`flex overflow-hidden rounded-full ${className ?? ""}`}>
      {src == null ? (
        <img
          src="https://via.placeholder.com/150"
          className="h-full w-full"
          alt=""
        />
      ) : (
        <img src={src} alt="Profile Image" className="object-cover" />
      )}
    </div>
  );
}
