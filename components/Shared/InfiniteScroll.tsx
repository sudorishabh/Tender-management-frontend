import { cn } from "@/lib/utils";
import { LoaderCircle } from "lucide-react";
import React, { FC, useEffect, useRef } from "react";

interface Props {
  hasMore: boolean;
  isFetching: boolean;
  refetch: () => void;
  children: React.ReactNode;
  className?: string;
  pageRef: React.MutableRefObject<number>;
  asTableRows?: boolean;
}
const InfiniteScroll: FC<Props> = ({
  hasMore,
  isFetching,
  refetch,
  children,
  className,
  pageRef,
  asTableRows = false,
}) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          pageRef.current += 1;
          refetch();
        }
      },
      { threshold: 1 }
    );
    observerRef.current = observer;
    const sentinel = document.querySelector("#sentinel");
    if (sentinel) observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, isFetching, refetch, pageRef]);

  if (asTableRows) {
    return (
      <>
        {children}
        <tr>
          <td colSpan={100}>
            <div
              id='sentinel'
              style={{ height: "20px" }}
            />
            {isFetching && <p>Loading more...</p>}
          </td>
        </tr>
      </>
    );
  }

  return (
    <div className={cn(className)}>
      {children}
      <div
        id='sentinel'
        style={{ height: "20px" }}
      />
      {isFetching && (
        <LoaderCircle className='mx-auto text-gray-600 animate-spin' />
      )}
    </div>
  );
};

export default InfiniteScroll;
