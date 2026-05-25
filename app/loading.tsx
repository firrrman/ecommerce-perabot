import { OrbitProgress } from "react-loading-indicators";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
      <OrbitProgress dense color="#000000" size="medium" text="" textColor="" />
    </div>
  );
}
