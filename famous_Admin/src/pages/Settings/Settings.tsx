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
import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { changeAdminPassword } from "@/features/admin/adminAuthSlice"; // Adjust path if needed

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{
    type: "success" | "error" | "idle";
    text: string;
  }>({ type: "idle", text: "" });

  const dispatch = useAppDispatch();
  // Correctly select from the store. Assuming 'auth' is the key, not 'adminAuth'.
  // If it IS 'adminAuth', then use state.adminAuth.
  const { status, error } = useAppSelector((state) => state.adminAuth); // <<< Ensure this is the correct key

  // Correctly initialize useNavigate if you were to use it later.
  // const navigate = useNavigate();

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    // --- ALL LOGIC MOVED INSIDE THE FUNCTION ---

    // Perform validation
    if (currentPassword.trim() === "" || newPassword.trim() === "" || confirmPassword.trim() === "") {
      setPasswordMessage({ type: 'error', text: "All fields are required." });
      return; // Stop execution
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: "New password and confirm password do not match." });
      return; // Stop execution
    }

    if (newPassword.length < 6) { // Example: Minimum password length
      setPasswordMessage({ type: 'error', text: "New password must be at least 6 characters long." });
      return; // Stop execution
    }

    // If validation passes, dispatch the thunk
    dispatch(changeAdminPassword({ currentPassword, newPassword }))
      .unwrap() // unwrap the promise to handle results
      .then(() => {
        setPasswordMessage({ type: 'success', text: "Password updated successfully!" });
        // Clear form fields on success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        // Clear the success message after a delay
        setTimeout(() => setPasswordMessage({ type: 'idle', text: '' }), 3000);
      })
      .catch((errorMsg: string) => {
        // Use the error from the caught promise, or fallback
        setPasswordMessage({ type: 'error', text: errorMsg || "Password change failed. Please try again." });
      });
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
                <div className="space-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

                <Button
                  type="submit"
                  disabled={
                    status === 'loading' ||
                    newPassword !== confirmPassword ||
                    currentPassword.trim() === '' ||
                    newPassword.trim() === '' ||
                    confirmPassword.trim() === ''
                  }
                >
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