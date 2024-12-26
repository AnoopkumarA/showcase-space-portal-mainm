import { useState, useEffect } from "react";
import { isFigmaUrl, getFigmaPreviewUrl, getFigmaFileKey } from "@/utils/figma";
import { isDribbbleUrl, getDribbbleImageUrl } from "@/utils/dribbble";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { PlusCircle, Link, Tags, Type, FileText, Sparkles, CheckCircle2 } from "lucide-react";
import { Project, ProjectType } from "@/types/project";
import { toast, useToast } from "./ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabase } from "@/contexts/SupabaseContext";
import { supabase } from "@/lib/supabase";
import { projectsService } from "@/lib/projects";

interface AddProjectDialogProps {
  onProjectAdd: (project: Project & { isNewProject?: boolean }) => void;
}

export const AddProjectDialog = ({ onProjectAdd }: AddProjectDialogProps) => {
  const { user } = useSupabase();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [url2, setUrl2] = useState("");
  const [type, setType] = useState<ProjectType>("website" as ProjectType);
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const loadPreview = async () => {
      if (url && type === "figma" && isFigmaUrl(url)) {
        const fileKey = getFigmaFileKey(url);
        if (fileKey && user) {  
          const figmaPreviewUrl = url.includes('community/file') 
            ? `https://www.figma.com/community/file/${fileKey}/thumbnail`
            : `https://www.figma.com/file/${fileKey}/thumbnail?ver=thumbnail`;
        }
      }
    };
  
    loadPreview();
  }, [url, type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add a project",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        title,
        description,
        type,
        url,
        url2,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        user_id: user.id,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

      const newProject: Project = {
        id: data.id.toString(),
        title: data.title,
        description: data.description,
        type: data.type,
        url: data.url,
        url2: data.url2,
        tags: data.tags,
        createdAt: data.created_at,
        category: data.type,
      };

      setShowSuccess(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      onProjectAdd({ ...newProject, isNewProject: true });
      setOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowSuccess(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setUrl2("");
    setType("website" as ProjectType);
    setTags("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6]/20 to-[#0EA5E9]/20 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
          <Button className="relative bg-black/50 backdrop-blur-sm text-white font-medium px-4 md:px-6 py-2 md:py-2.5 rounded-full border border-purple-500/20 flex items-center gap-1.5 md:gap-2 hover:bg-black/60 transition-all duration-300">
            <PlusCircle className="w-4 h-4 md:w-5 md:h-5 text-[#8B5CF6]" />
            <span className="text-sm md:text-base bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text">Add Project</span>
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-b from-[#1A1F2C] to-[#1A1F2C]/95 border border-[#8B5CF6]/20 backdrop-blur-xl text-white w-[95vw] md:w-full max-w-lg mx-auto p-4 md:p-6">
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 rounded-lg"
            >
              <motion.div 
                initial={{ scale: 0.5, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 20 }}
                transition={{ 
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                  duration: 0.3
                }}
                className="bg-gradient-to-r from-[#8B5CF6]/20 to-[#D946EF]/20 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center gap-2 border border-purple-500/20"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: [0, 1.2, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    times: [0, 0.6, 0.8, 1]
                  }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-full blur-lg opacity-60 animate-pulse" />
                  <CheckCircle2 className="w-10 h-10 text-white relative" />
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-base font-medium bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text"
                >
                  Project Added Successfully!
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-transparent bg-clip-text flex items-center gap-1.5 md:gap-2">
            <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#8B5CF6]" />
            Add New Project
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="title" className="text-sm md:text-base text-gray-300 flex items-center gap-1.5 md:gap-2">
              <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B5CF6]" />
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project title"
              required
              className="text-sm md:text-base h-9 md:h-10 bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500 focus:border-[#D946EF] transition-colors duration-200"
            />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="description" className="text-sm md:text-base text-gray-300 flex items-center gap-1.5 md:gap-2">
              <Type className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B5CF6]" />
              Description
            </Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Project description"
              required
              className="text-sm md:text-base h-9 md:h-10 bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="type" className="text-sm md:text-base text-gray-300 flex items-center gap-1.5 md:gap-2">
              <Type className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B5CF6]" />
              Type
            </Label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as ProjectType)}
              className="text-sm md:text-base h-9 md:h-10 w-full rounded-md border border-[#8B5CF6]/20 bg-[#403E43]/30 px-2 md:px-3 py-1.5 md:py-2 text-white"
            >
              <option value="website">Website</option>
              <option value="figma">Figma</option>
              <option value="other">Others</option>
            </select>
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="url" className="text-sm md:text-base text-gray-300 flex items-center gap-1.5 md:gap-2">
              <Link className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B5CF6]" />
              Project URL
            </Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Hosted URL"
              required
              className="text-sm md:text-base h-9 md:h-10 bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="url2" className="text-sm md:text-base text-gray-300 flex items-center gap-1.5 md:gap-2">
              <Link className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B5CF6]" />
              Code/File URL
            </Label>
            <Input
              id="url2"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              placeholder="Github or File UR"
              className="text-sm md:text-base h-9 md:h-10 bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="space-y-1.5 md:space-y-2">
            <Label htmlFor="tags" className="text-sm md:text-base text-gray-300 flex items-center gap-1.5 md:gap-2">
              <Tags className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#8B5CF6]" />
              Tags
            </Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
              className="text-sm md:text-base h-9 md:h-10 bg-[#403E43]/30 border-[#8B5CF6]/20 text-white placeholder:text-gray-500"
            />
          </div>
          <div className="pt-2 md:pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white font-medium py-2 md:py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                  Add Project
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
