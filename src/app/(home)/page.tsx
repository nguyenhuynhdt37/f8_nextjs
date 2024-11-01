import { Category } from "@/components/client/Home";
import Image from "next/image";

export default function Home() {
  return (
    <div className="px-32 pt-16">
      <Category />
      <Category />
      <Category />
      <Category />
    </div>
  );
}
