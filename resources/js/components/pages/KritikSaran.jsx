// resources/js/pages/KritikSaranPage.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function KritikSaran() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      alert('Terima kasih atas masukan Anda!');
      setMessage('');
    }
  };

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto border-0">
            <CardHeader>
              <CardTitle className="text-2xl text-[#374151]">Kritik & Saran</CardTitle>
              <p className="text-[#6B7280]">
                Bantu kami menjadi lebih baik. Masukan Anda sangat berarti!
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan kritik atau saran Anda di sini..."
                  className="min-h-[150px] border-[#FDE68A] focus-visible:ring-[#FACC15]"
                />
                <Button
                  type="submit"
                  className="w-full bg-[#FACC15] text-black hover:bg-[#EAB308] flex items-center justify-center gap-2"
                >
                  <Send size={18} />
                  Kirim
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}