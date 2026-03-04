// components/ui/Skeleton.tsx
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      // Koristimo tvoju novu tamnu pozadinu i blagi tirkizni sjaj za animaciju
      className={`animate-pulse rounded-md bg-zazu-dark border border-[#1f2230] ${className}`}
      {...props}
    />
  );
}