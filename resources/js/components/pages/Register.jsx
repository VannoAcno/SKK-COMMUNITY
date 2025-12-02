import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import api from "@/lib/api"; // jika belum ada, nanti aku buatkan

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/register", form);

      alert("Register berhasil!");
      // Atau redirect
      // window.location.href = "/login";
    } catch (error) {
      console.error(error);
      alert("Gagal register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Registrasi Akun
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Nama Lengkap</label>
              <Input
                type="text"
                name="name"
                placeholder="Masukkan nama"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Email</label>
              <Input
                type="email"
                name="email"
                placeholder="Masukkan email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="Masukkan password"
                value={form.password}
                onChange={onChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Konfirmasi Password</label>
              <Input
                type="password"
                name="password_confirmation"
                placeholder="Masukkan ulang password"
                value={form.password_confirmation}
                onChange={onChange}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Daftar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
