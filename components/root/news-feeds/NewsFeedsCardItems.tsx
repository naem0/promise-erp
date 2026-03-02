import { NewsFeedItem } from "@/apiServices/homePageService";
import Image from "next/image";
import Link from "next/link";

interface NewsFeedsCardItemsProps {
  item: NewsFeedItem;
}
const NewsFeedsCardItems = ({ item }: NewsFeedsCardItemsProps) => {
  return (
    <Link
      href={item.news_link || "#"}
      className="block rounded-lg shadow-md p-4 w-full h-[230px] lg:h-[330px] relative overflow-hidden"
    >
      <Image
        src={item.image || "/images/placeholder_img.jpg"}
        alt={item.news_link || "News Image"}
        fill
        className="object-cover rounded-lg transition-transform duration-300 hover:scale-105"
      />
    </Link>
  );
};

export default NewsFeedsCardItems;
