import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, MapPin, Upload, Image } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { complaintsApi } from "@/services/complaintsApi";
import { DEPARTMENTS } from "@/config/departments";

const RaiseComplaint: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>(DEPARTMENTS[0]);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [formValues, setFormValues] = useState({ title: "", description: "", location: "" });

  const handleImageUpload = () => {
    setImageUploaded(true);
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUploaded) {
      toast({ title: "Image required", description: "Please upload photo evidence before submitting.", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      await complaintsApi.create({
        title: formValues.title,
        description: formValues.description,
        category,
        location: formValues.location,
        image: imageUploaded ? "uploaded" : undefined,
      });
      toast({ title: "Complaint Submitted", description: `Complaint recorded under ${category}.` });
      navigate("/citizen/complaints");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err.message || "Unable to submit complaint.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Raise a Complaint</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Describe your issue and upload a photo for AI-assisted routing</p>
      </div>

      <Card className="glass-card">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formValues.title}
                onChange={handleInputChange}
                placeholder="Brief summary of your complaint"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger id="category" className="mt-1.5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {category && (
                <p className="text-xs text-muted-foreground mt-1">
                  Department: {category}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formValues.description}
                onChange={handleInputChange}
                placeholder="Provide detailed description..."
                className="mt-1.5 min-h-[120px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  name="location"
                  value={formValues.location}
                  onChange={handleInputChange}
                  placeholder="Area, sector, landmark..."
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Required image upload */}
            <div>
              <Label>Photo Evidence <span className="text-destructive">*</span></Label>
              <div
                onClick={handleImageUpload}
                className={`mt-1.5 border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
                  imageUploaded ? "border-success/40 bg-success/5" : "border-border hover:border-primary/40"
                }`}
              >
                {imageUploaded ? (
                  <>
                    <Image className="w-6 h-6 text-success mx-auto mb-2" />
                    <p className="text-sm text-success font-medium">Image uploaded successfully</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload photo proof (required)</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 10MB</p>
                  </>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : (
                <><Send className="w-4 h-4 mr-2" /> Submit Complaint</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RaiseComplaint;
