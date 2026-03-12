import React, { useState, useEffect } from "react";
import { User, Truck, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { getMyProfile } from "../lib/api";

const UserProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const result = await getMyProfile();
        setProfileData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-slate-500 animate-pulse">Đang tải thông tin...</p>
        </main>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <p className="text-red-500">Lỗi: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />

      <main className="flex-grow max-w-5xl mx-auto w-full p-6 py-10">
        <h1 className="text-3xl font-bold mb-8 text-slate-800">
          Tài khoản của tôi
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Thông tin cá nhân */}
          <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                <User size={24} />
              </div>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow text-sm">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Mail size={16} /> Email
                </span>
                <span className="font-medium">
                  {profileData?.email || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User size={16} /> Tên hiển thị
                </span>
                <span className="font-medium">
                  {profileData?.username || "Chưa cập nhật"}
                </span>
              </div>
            
            </CardContent>
            <CardFooter className="border-t pt-4 mt-auto">
              <Button
                variant="link"
                className="text-orange-600 p-0 h-auto flex items-center"
              >
                Đổi mật khẩu <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>

          {/* Card 2: Liên hệ & Giao hàng */}
          <Card className="border-none shadow-sm h-full flex flex-col">
            <CardHeader className="flex flex-row items-center space-x-4 pb-4">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Truck size={24} />
              </div>
              <CardTitle>Liên hệ & Giao hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow text-sm">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-muted-foreground flex items-center gap-2 min-w-[100px]">
                  <Phone size={16} /> Điện thoại
                </span>
                <span className="font-medium text-right">
                  {profileData?.phone_number || "Chưa cập nhật"}
                </span>
              </div>
              <div className="flex justify-between items-start border-b pb-3">
                <span className="text-muted-foreground flex items-center gap-2 min-w-[100px] mt-1">
                  <MapPin size={16} /> Địa chỉ
                </span>
                <span className="font-medium text-right max-w-[250px] leading-relaxed">
                  {profileData?.user_address ||
                    "Chưa thiết lập địa chỉ giao hàng"}
                </span>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-auto">
              <Button
                variant="link"
                className="text-orange-600 p-0 h-auto flex items-center"
              >
                Cập nhật thông tin <ChevronRight size={16} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
