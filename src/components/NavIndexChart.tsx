import { useLayoutEffect, useRef, HTMLAttributes } from "react";
import { useSet } from "rippling";
import { renderNavIndex } from "../atoms/portfolio";

export default function NavIndexChart(props: HTMLAttributes<HTMLDivElement>) {
  const elemRef = useRef<HTMLDivElement>(null);
  const renderChart = useSet(renderNavIndex);

  useLayoutEffect(() => {
    if (!elemRef.current) return;
    renderChart(elemRef.current);
  });

  return (
    <>
      <div {...props} ref={elemRef} />
    </>
  );
}
