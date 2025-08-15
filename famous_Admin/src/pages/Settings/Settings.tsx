import React, { useState } from "react";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


import { useAppSelector } from "@/hooks/hooks";
// import { changeAdminPassword } from "@/features/admin/adminAuthSlice"; // Adjust path if needed
import apiClient from "@/lib/axios";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error" | "idle";
    text: string;
  }>({ type: "idle", text: "" });



  
  const { status,token } = useAppSelector((state) => state.adminAuth); 

  console.log(token)
  
const handlePasswordChange = async (e: React.FormEvent) => {
  e.preventDefault();
  if (currentPassword.trim() === "" || newPassword.trim() === "") {
    setPasswordMessage({ type: 'error', text: "All fields are required." });
    return;
  }
  if (newPassword.length < 6) {
    setPasswordMessage({ type: 'error', text: "New password must be at least 6 characters long." });
    return;
  }
  try {
    await apiClient.post(
      "/admin/change-password",
      { currentPassword, newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setPasswordMessage({ type: 'success', text: "Password updated successfully!" });
    setCurrentPassword("");
    setNewPassword("");
    setTimeout(() => setPasswordMessage({ type: 'idle', text: '' }), 3000);
  } catch (error: any) {
    setPasswordMessage({
      type: 'error',
      text: error.response?.data?.message || "Password change failed. Please try again.",
    });
  }
};


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your store settings and preferences
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {/* ... General Tab Content ... */}
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Update your store details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input id="storeName" defaultValue="Watch Store" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    defaultValue="admin@watchstore.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeDescription">Store Description</Label>
                <Textarea
                  id="storeDescription"
                  defaultValue="Premium watch collection for enthusiasts"
                />
              </div>
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Upload store logo
                  </p>
                </div>
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {/* ... Notifications Tab Content ... */}
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Orders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when new orders are placed
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Stock Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when products are running low
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Customer Messages</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified of customer inquiries
                  </p>
                </div>
                <Switch />
              </div>
              <Button>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                

                {/* Display feedback messages */}
                {passwordMessage.type === 'success' && (
                  <p className="text-sm text-green-500">{passwordMessage.text}</p>
                )}
                {passwordMessage.type === 'error' && (
                  <p className="text-sm text-red-500">{passwordMessage.text}</p>
                )}

               <Button type="submit" disabled={status === 'loading'}>
  {status === 'loading' ? 'Updating...' : (
    <>
      <Save className="h-4 w-4 mr-2" />
      Update Password
    </>
  )}
</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}