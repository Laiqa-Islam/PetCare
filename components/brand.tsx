import Link from "next/link";
import { PawIcon } from "./icons";

export function Brand({ compact = false }: { compact?: boolean }) {
  return <Link className="brand" href="/" aria-label="FurShield home"><span className="brand-mark"><PawIcon size={compact ? 17 : 20} /></span><span>Fur<span>Shield</span></span></Link>;
}
