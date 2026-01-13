import { adminLogoutAction } from "../actions/login";
import { LogOut } from "lucide-react";
export default function Logout() {
  return (
    <form action={adminLogoutAction}>
      <button
        className="w-full flex items-center cursor-pointer space-x-3 px-4 py-3 rounded-lg transition-all
                text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <LogOut size={20} className="mr-3" />
        keluar
      </button>
    </form>
  );
}
