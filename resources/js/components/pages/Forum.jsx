// resources/js/pages/forum/ForumPage.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, User, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarAfter from '@/components/shared/NavbarAfter';
import Footer from '@/components/shared/Footer';

export default function Forum() {
  const discussions = [
    {
      id: 1,
      title: 'Apa renunganmu hari ini?',
      author: 'Maria S.',
      time: '2 jam yang lalu',
      replies: 12,
    },
    {
      id: 2,
      title: 'Persiapan Retret Pemuda 2025',
      author: 'Tim SKK',
      time: '1 hari yang lalu',
      replies: 24,
    },
    {
      id: 3,
      title: 'Doa untuk Teman yang Sakit',
      author: 'Yohanes T.',
      time: '3 hari yang lalu',
      replies: 8,
    },
  ];

  return (
    <>
      <NavbarAfter />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-[#374151]">Forum Diskusi</h1>
            <button className="bg-[#FACC15] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#EAB308]">
              Buat Diskusi
            </button>
          </div>

          <div className="space-y-4">
            {discussions.map((post) => (
              <Link key={post.id} to={`/forum/${post.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-[#374151]">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center text-sm text-[#6B7280] space-x-4">
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={14} />
                        <span>{post.time}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle size={14} />
                        <span>{post.replies} balasan</span>
                      </div>
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