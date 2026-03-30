import { NewsFeedItem } from "@/apiServices/homePageService";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface NewsFeedsCardItemsProps {
  item: NewsFeedItem;
}
const NewsFeedsCardItems = ({ item }: NewsFeedsCardItemsProps) => {
  return (
    <Card className="shadow-md rounded-lg h-full py-0">
      <CardContent className="py-4 px-4 ">
        <h4 className="mb-4">
          <Link href={item.news_link || "#"} className="text-base lg:text-xl font-bold">
            {item.title}
          </Link>
        </h4>
        <Link
          href={item.news_link || "#"}
          className="block w-full h-full relative"
        >
          <div className="w-full h-[260px] lg:h-[330px] relative border border-primary/10 rounded-lg ">
            <Image
              src={item.image || "/images/placeholder_img.jpg"}
              alt={item.news_link || "News Image"}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

export default NewsFeedsCardItems;
