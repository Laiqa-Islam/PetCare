import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function IconBase({ size = 20, children, ...props }: IconProps & { children: ReactNode }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{children}</svg>;
}

export const PawIcon = (props: IconProps) => <IconBase {...props}><path d="M12 13.6c-3.6 0-6.6 2.4-6.6 5.1 0 1.6 1.2 2.5 2.8 2.5 1.1 0 2.2-.6 3.8-.6s2.7.6 3.8.6c1.6 0 2.8-.9 2.8-2.5 0-2.7-3-5.1-6.6-5.1Z"/><ellipse cx="5.4" cy="10.2" rx="2.2" ry="2.9" transform="rotate(-24 5.4 10.2)"/><ellipse cx="18.6" cy="10.2" rx="2.2" ry="2.9" transform="rotate(24 18.6 10.2)"/><ellipse cx="9.3" cy="5.8" rx="2.2" ry="3" transform="rotate(-8 9.3 5.8)"/><ellipse cx="14.7" cy="5.8" rx="2.2" ry="3" transform="rotate(8 14.7 5.8)"/></IconBase>;
export const SearchIcon = (props: IconProps) => <IconBase {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></IconBase>;
export const HeartIcon = (props: IconProps) => <IconBase {...props}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/></IconBase>;
export const CalendarIcon = (props: IconProps) => <IconBase {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></IconBase>;
export const ShieldIcon = (props: IconProps) => <IconBase {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-5"/></IconBase>;
export const BagIcon = (props: IconProps) => <IconBase {...props}><path d="M6 8h12l1 13H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></IconBase>;
export const SearchArrowIcon = (props: IconProps) => <IconBase {...props}><path d="M5 12h14M14 7l5 5-5 5"/></IconBase>;
export const ArrowIcon = SearchArrowIcon;
export const MapPinIcon = (props: IconProps) => <IconBase {...props}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></IconBase>;
export const StarIcon = (props: IconProps) => <IconBase {...props}><path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9L12 2.5Z"/></IconBase>;
export const BellIcon = (props: IconProps) => <IconBase {...props}><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></IconBase>;
export const UsersIcon = (props: IconProps) => <IconBase {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></IconBase>;
export const StethoscopeIcon = (props: IconProps) => <IconBase {...props}><path d="M6 3v5a5 5 0 0 0 10 0V3M4 3h4M14 3h4M11 13v3a5 5 0 0 0 10 0v-1"/><circle cx="21" cy="13" r="2"/></IconBase>;
export const HomeIcon = (props: IconProps) => <IconBase {...props}><path d="m3 11 9-8 9 8v10h-6v-6H9v6H3V11Z"/></IconBase>;
export const FileIcon = (props: IconProps) => <IconBase {...props}><path d="M6 2h9l5 5v15H6V2Z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></IconBase>;
export const MenuIcon = (props: IconProps) => <IconBase {...props}><path d="M4 7h16M4 12h16M4 17h16"/></IconBase>;
export const LogOutIcon = (props: IconProps) => <IconBase {...props}><path d="M10 17l5-5-5-5M15 12H3M14 3h7v18h-7"/></IconBase>;
export const ClockIcon = (props: IconProps) => <IconBase {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></IconBase>;
export const ActivityIcon = (props: IconProps) => <IconBase {...props}><path d="M3 12h4l2-7 4 14 2-7h6"/></IconBase>;
export const CheckIcon = (props: IconProps) => <IconBase {...props}><path d="m5 12 4 4L19 6"/></IconBase>;
export const PlusIcon = (props: IconProps) => <IconBase {...props}><path d="M12 5v14M5 12h14"/></IconBase>;
export const ChevronRightIcon = (props: IconProps) => <IconBase {...props}><path d="m9 18 6-6-6-6"/></IconBase>;
