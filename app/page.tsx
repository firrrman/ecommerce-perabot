import { createUser, deleteUser, updateUser, getUsers } from "./actions/users";

export default async function Home() {
  const users = await getUsers();
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CRUD USERRRRRRRR Firmannnn</h1>

      {/* LIST USER */}
      <div className="space-y-6">
        {users.map((u: any) => (
          <div key={u.id} className="bg-white shadow-md p-5 rounded-xl border">
            <h3 className="text-xl font-semibold mb-1">
              {u.name}{" "}
              <span className="text-gray-600 text-sm">({u.email})</span>
            </h3>

            {/* POSTS */}
            <div className="ml-4 mb-4">
              {u.posts.map((p: any) => (
                <p key={p.id} className="text-gray-700">
                  • {p.title}
                </p>
              ))}
            </div>

            {/* FORM UPDATE */}
            <form
              action={updateUser}
              className="flex flex-col gap-3 mt-3 bg-gray-50 p-4 rounded-lg"
            >
              <input type="hidden" name="id" value={u.id} />

              <input
                name="name"
                defaultValue={u.name ?? ""}
                placeholder="Nama Baru"
                required
                className="border rounded-lg p-2"
              />

              <input
                name="email"
                defaultValue={u.email ?? ""}
                type="email"
                placeholder="Email Baru"
                required
                className="border rounded-lg p-2"
              />

              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded-lg"
              >
                Update
              </button>
            </form>

            {/* FORM DELETE */}
            <form action={deleteUser} className="mt-3">
              <input type="hidden" name="id" value={u.id} />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg w-full"
              >
                Delete
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* FORM CREATE */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Tambah User Baru</h2>

      <form
        action={createUser}
        className="bg-white shadow-md p-6 rounded-xl border flex flex-col gap-3"
      >
        <input
          name="name"
          placeholder="Nama"
          required
          className="border rounded-lg p-2"
        />

        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          className="border rounded-lg p-2"
        />

        <input
          name="title"
          placeholder="Judul Post"
          required
          className="border rounded-lg p-2"
        />

        <textarea
          name="content"
          placeholder="Isi Post"
          required
          className="border rounded-lg p-2 h-24"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Simpan
        </button>
      </form>
    </div>
  );
}
