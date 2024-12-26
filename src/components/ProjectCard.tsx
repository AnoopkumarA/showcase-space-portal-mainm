import { Project, ProjectType } from "@/types/project";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { ExternalLink, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { PreviewDialog } from "./PreviewDialog";
import { isYouTubeUrl, getYouTubeVideoId, getYouTubeThumbnailUrl } from "@/utils/youtube";
import { isFigmaUrl, getFigmaFileKey, getFigmaThumbnailUrl } from "@/utils/figma";
import { getVideoPreview } from "@/utils/getVideoPreview";

interface ProjectCardProps {
  project: Project;
  onView?: (project: Project) => void;
  isNewProject?: boolean;
}

export const ProjectCard = ({ project, onView, isNewProject = false }: ProjectCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isNewProject);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    const loadPreview = async () => {
      if (project.url) {
        if (isYouTubeUrl(project.url)) {
          const videoId = getYouTubeVideoId(project.url);
          if (videoId) {
            setThumbnailUrl(getYouTubeThumbnailUrl(videoId));
          }
        } else if (isFigmaUrl(project.url)) {
          const fileKey = getFigmaFileKey(project.url);
          if (fileKey) {
            const figmaThumbnail = getFigmaThumbnailUrl(fileKey);
            setThumbnailUrl(project.imageUrl || figmaThumbnail);
          }
        }
      }
      setIsLoading(false);
    };

    loadPreview();
  }, [project.url, project.imageUrl]);

  const getPreviewContent = () => {
    const { type, id } = getVideoPreview(project.url);

    if (type === 'instagram') {
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-16 h-16" fill="white">
            <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
          </svg>
        </div>
      );
    }

    if (type === 'youtube' || thumbnailUrl) {
      return (
        <img
          src={type === 'youtube' ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : thumbnailUrl || ''}
          alt={project.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            setIframeError(true);
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      );
    }

    return (
      <div className="w-full h-full bg-gradient-to-br from-[#8B5CF6]/20 to-[#D946EF]/20 flex items-center justify-center">
        <span className="text-white/50">No preview available</span>
      </div>
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="relative bg-[#0A192F] overflow-hidden group hover:shadow-xl transition-all duration-300 backdrop-blur-lg border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#0EA5E9]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="p-0">
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
              {getPreviewContent()}
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                <div className="flex gap-3 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300">
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative overflow-hidden bg-transparent border border-[#8B5CF6] text-white hover:text-white group/btn"
                    onClick={() => setShowPreview(true)}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Preview
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="relative overflow-hidden bg-transparent border border-[#0EA5E9] text-white hover:text-white group/btn"
                    onClick={() => window.open(project.url, "_blank")}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Visit
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0EA5E9] to-[#8B5CF6] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 text-left relative z-10">
            <h3 className="font-bold text-lg mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9] group-hover:from-[#D946EF] group-hover:to-[#8B5CF6] transition-all duration-300">
              {project.title}
            </h3>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2 group-hover:text-gray-200 transition-colors duration-300">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge
                  key={tag}
                  className="relative overflow-hidden px-3 py-1 bg-[#1E293B] border border-[#8B5CF6]/20 text-xs font-medium text-gray-300 group-hover:border-[#8B5CF6]/40 transition-all duration-300 hover:scale-105 cursor-default"
                  style={{
                    animation: `pulseGlow ${2 + index * 0.2}s infinite`,
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#0EA5E9]" />
                    {tag}
                  </span>
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/10 to-[#0EA5E9]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 90% 100%, 10% 100%)'
                    }}
                  />
                </Badge>
              ))}
            </div>
            <style jsx global>{`
              @keyframes pulseGlow {
                0%, 100% {
                  box-shadow: 0 0 0 0 rgba(139, 92, 246, 0);
                }
                50% {
                  box-shadow: 0 0 4px 1px rgba(139, 92, 246, 0.2);
                }
              }
            `}</style>
          </CardContent>
        </Card>
      </motion.div>

      <PreviewDialog 
        project={project}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </>
  );
};
