// resources/js/pages/kegiatan/KegiatanPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, MapPin, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Kegiatan() {
  const events = [
    {
      id: 1,
      type: 'agenda',
      title: 'Retret Pemuda 2025',
      date: '15–17 Februari 2025',
      location: 'Villa Bukit Berbunga, Batu',
    },
    {
      id: 2,
      type: 'agenda',
      title: 'Bakti Sosial SKK',
      date: '22 Maret 2025',
      location: 'Panti Asuhan Kasih Bunda, Surabaya',
    },
    {
      id: 3,
      type: 'report',
      title: 'Laporan Kebaktian Bersama',
      date: '5 April 2025',
      summary: 'Kebaktian dihadiri 150+ siswa dari 12 sekolah.',
    },
  ];

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#374151]">Kegiatan</h1>
            <button className="bg-[#FACC15] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#EAB308]">
              Tambah Kegiatan
            </button>
          </div>

          <div className="space-y-6">
            {events.map((event) => (
              <Link key={event.id} to={`/kegiatan/${event.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow border-0">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-[#374151]">{event.title}</CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.type === 'agenda' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {event.type === 'agenda' ? 'Agenda' : 'Laporan'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-[#6B7280]">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{event.date}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin size={14} />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.summary && (
                        <div className="flex items-start space-x-1">
                          <FileText size={14} className="mt-0.5" />
                          <span>{event.summary}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}