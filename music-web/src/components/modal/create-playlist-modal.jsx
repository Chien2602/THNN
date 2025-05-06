"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea" // đảm bảo bạn có component này
import { cn } from "@/lib/utils"
import { usePlayer } from "../player-provider"
import axios from "axios"

export default function CreatePlaylistModal({ open, setOpen }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { currentUser } = usePlayer()

  useEffect(() => {
    console.log("Current user:", currentUser)
  }, [currentUser])

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!currentUser || !currentUser._id) {
      console.error("Không có thông tin người dùng.");
      return;
    }
  
    try {
      setIsLoading(true);
  
      const response = await axios.post("http://localhost:3001/api/playlists", {
        playlistName: name,
        userId: currentUser._id,
      });
  
      console.log("Playlist created:", response.data);
  
      setName("");
      setDescription("");
      setOpen(false);
    } catch (error) {
      console.error("Lỗi khi tạo playlist:", error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px] h-auto !rounded-2xl border-none bg-white shadow-xl p-6 text-black">
        <DialogHeader className="pt-4">
          <DialogTitle className="text-2xl font-bold text-center text-purple-700">Create New Playlist</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Fill in the details to create your new playlist.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="grid gap-5 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right font-medium text-gray-700">
                Name
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={cn(
                    "bg-gray-100",
                    "transition-all duration-200 rounded-xl pl-3 pr-3 py-2 w-full",
                  )}
                  placeholder="My Awesome Playlist"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right font-medium text-gray-700 pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={cn(
                  "col-span-3 bg-gray-100 border-none",
                  "transition-all duration-200 rounded-xl resize-none min-h-[100px]",
                )}
                placeholder="What's this playlist about?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="flex gap-3 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-[8px] border-gray-300 hover:bg-gray-400 cursor-pointer text-white bg-black transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-[8px] bg-purple-600 hover:bg-purple-700 cursor-pointer text-white gap-2 px-5 py-2 transition-all duration-200 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              <Sparkles size={16} className="animate-pulse" />
              {isLoading ? "Creating..." : "Create Playlist"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
