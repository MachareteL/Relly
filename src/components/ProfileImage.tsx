type ProfileImageProps = {
  src?: string | null;
  className?: string;
};

export function ProfileImage({ src, className }: ProfileImageProps) {
  return (
    <div className={`h-8 w-8 rounded-full overflow-hidden ${className}`}>
      {src == null ? (
        <img src="https://via.placeholder.com/150" className="h-full w-full" />
      ) : (
        <img src={src} alt="Profile Image" />
      )}
    </div>
  );
}
