import React, { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function CreateParentPage() {
  const [form, setForm] = useState({
    name: "",
    primaryPhone: "",
    secondaryPhone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `http://${import.meta.env.VITE_API_HOST}:${
          import.meta.env.VITE_API_PORT
        }/api/parent`,
        form
      );

      toast.success(`${form.name} has been added successfully!`);

      setForm({
        name: "",
        primaryPhone: "",
        secondaryPhone: "",
        address: "",
      });
    } catch (err) {
      console.error("Error creating parent", err);
      toast.error("Failed to create parent. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Create New Parent</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="primaryPhone">Primary Phone</Label>
              <Input
                id="primaryPhone"
                name="primaryPhone"
                value={form.primaryPhone}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="secondaryPhone">Secondary Phone</Label>
              <Input
                id="secondaryPhone"
                name="secondaryPhone"
                value={form.secondaryPhone}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create Parent"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
