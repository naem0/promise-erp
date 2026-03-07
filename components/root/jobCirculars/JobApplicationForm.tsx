"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const JobApplicationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    coverLetter: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Application submitted successfully!");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="space-y-4">
      <Card className="py-0 gap-4">
        <CardHeader className="bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg rounded-tl-xl rounded-tr-xl text-white text-center px-4 py-8">
          <CardTitle className="text-2xl font-bold text-white">
            Get Hired
          </CardTitle>
          <CardDescription className="text-white">
            Apply today to join Bangladesh s biggest IT Training Institute!
          </CardDescription>
        </CardHeader>

        <CardContent className="p-3 lg:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Your Name*
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-background border-input focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Your Email*
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-background border-input focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number*
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+880 1XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-background border-input focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Present Address
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Your current address"
                value={formData.address}
                onChange={handleChange}
                className="bg-background border-input focus:ring-2 focus:ring-secondary/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverLetter" className="text-sm font-medium">
                Cover Letter
              </Label>
              <Textarea
                id="coverLetter"
                name="coverLetter"
                placeholder="Tell us why you're the perfect fit"
                value={formData.coverLetter}
                onChange={handleChange}
                rows={4}
                className="bg-background border-input focus:ring-2 focus:ring-secondary/20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Upload CV/Resume*</Label>
              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center hover:border-secondary/50 transition-colors cursor-pointer bg-muted/30">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag & drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>
            </div>

            <Button className="w-full shadow-lg hover:shadow-xl" type="submit">Submit Application</Button>

            <p className="text-xs text-center text-muted-foreground">
              By applying, you agree to our Terms of Service and Privacy Policy
            </p>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-r to-[#009F41] from-0% via-[#1C833E] via-40% from-[#0B5B28] to-100% border-none shadow-lg rounded-tl-xl">
        <CardContent className="p-6 text-center">
          <p className="text-white mb-3 font-medium">
            Know someone perfect for this role?
          </p>
          <Button variant="outline" className="bg-white w-full shadow-lg hover:shadow-xl">
            <Share2 className="w-4 h-4 mr-2" />
            Share This Job
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationForm;
