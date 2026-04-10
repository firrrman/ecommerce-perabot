import { adminLogoutAction } from "../actions/login";
import { LogOut } from "lucide-react";

export default function Logout() {
  const handleConfirm = (e: React.FormEvent) => {
    const confirmLogout = confirm("Apakah Anda yakin ingin keluar?");
    if (!confirmLogout) {
      e.preventDefault();
    }
  };

  return (
    <form action={adminLogoutAction} onSubmit={handleConfirm}>
      <button
        type="submit"
        className="w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-lg transition-all
        text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <LogOut size={20} className="mr-3" />
        Keluar
      </button>
    </form>
  );
}
