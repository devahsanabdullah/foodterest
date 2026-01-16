import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import Image from "next/image";
import { Separator } from "../ui/separator";

type PinCardProps = {
  image: string;
  title: string;
  owner: string;
  avatar: string;
  pins: number;
  boards: number;
  likes: number;
  followers: number;
  repins: number;
  comments: number;
  description: string;
};

export default function PinCard({
  image,
  title,
  owner,
  avatar,
  pins,
  description,
  boards,
  likes,
  followers,
  repins,
  comments,
}: PinCardProps) {
  return (
    <Card className="group py-0 pb-2 relative overflow-hidden rounded-md bg-white shadow cursor-pointer hover:shadow-lg transition">

      {/* Image */}
      <div className="relative aspect-3/3 py-0 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">

          {/* Top Right Icon */}
          <div className="flex justify-end">
            <Button size="icon" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white">
              <Bookmark className="h-4 w-4 text-black" />
            </Button>
          </div>

          {/* Owner Mini Card */}
          <div className="bg-white/95 backdrop-blur rounded-lg p-2 space-y-2">
            <div className="flex items-center gap-2">
              <Image src={avatar} alt={owner} width={28} height={28} className="rounded-full" />
              <span className="text-sm font-semibold text-gray-800 truncate">{owner}</span>
            </div>

            <div className="grid grid-cols-2 text-[10px] text-gray-600 gap-y-1">
              <span>Pins</span><span className="text-right">{pins}</span>
              <span>Boards</span><span className="text-right">{boards}</span>
              <span>Likes</span><span className="text-right">{likes}</span>
              <span>Followers</span><span className="text-right">{followers}</span>
            </div>

            <Button size="sm" className="w-full h-7 text-xs rounded-md bg-red-500 hover:bg-red-600">
              Follow
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="px-4 space-y-1 pb-1">
        <p className="text-sm font-medium pb-1 text-gray-800 line-clamp-2">{description}</p>

        <Separator className="my-1" />

        <div className="flex justify-between px-2 text-[12px] text-gray-500 py-1">
          <div className="flex items-center gap-1"><Repeat2 className="h-4 w-4" /> {repins}</div>
          <div className="flex items-center gap-1"><Heart className="h-4 w-4" /> {likes}</div>
          <div className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {comments}</div>
        </div>
      </div>
    </Card>
  );
}
