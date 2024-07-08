import { CSSProperties } from 'react';

export type LoaderProps = {
  bgColor?: CSSProperties['color'];
};

export function Loader({ bgColor = '#fff' }: LoaderProps) {
  return <div className="loader p-1 rounded-full" style={{ backgroundColor: bgColor }} />;
}
