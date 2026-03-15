import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
export interface ToolProp {
  id?: number;
  title: string;
  sub_title?: string;
  image?: string | null;
}

const TOOL_PLACEHOLDER = "https://placehold.co/64x64/4f46e5/ffffff/png?text=Tool";

export const ToolsSection = ({ tools, title }: { tools: ToolProp[]; title?: string }) => {
  if (tools.length === 0) return null;

  return (
    <Card className="bg-muted/30">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold text-center mb-8 animate-in fade-in duration-500">{title || "Tools & Technologies You Will Master"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => (
            <Card key={tool.id || index} className="text-center hover:scale-105 transition-transform h-full">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 overflow-hidden">
                  {tool.image ? (
                    <Image
                      src={tool.image || TOOL_PLACEHOLDER}
                      alt={tool.title}
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold">{tool.title.substring(0, 2)}</span>
                  )}
                </div>
                <h3 className="font-semibold mb-2">{tool.title}</h3>
                {tool.sub_title && (
                  <p className="text-sm text-muted-foreground">{tool.sub_title}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
