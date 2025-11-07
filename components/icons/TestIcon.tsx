
import React from 'react';

export const TestIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.5 11H19V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4"></path>
    <path d="m16 19-2-2 2-2"></path>
    <path d="m22 19-2-2 2-2"></path>
    <path d="M12 12H5"></path>
    <path d="M12 8H5"></path>
  </svg>
);
