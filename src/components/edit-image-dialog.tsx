'use client';
import { useState, useRef, ReactNode } from 'react';
import ReactCrop, { type Crop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}


export const EditImageDialog = ({ trigger, onSave, aspectRatio }: { trigger: ReactNode, onSave: (url: string) => void, aspectRatio: number }) => {
    const [imgSrc, setImgSrc] = useState('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<Crop>();
    const [open, setOpen] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);
    const { toast } = useToast();

    function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setCrop(undefined); // Makes crop preview update between images.
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImgSrc(reader.result?.toString() || ''),
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspectRatio));
    }

    async function handleSaveCrop() {
        const image = imgRef.current;
        if (!image || !completedCrop) {
          throw new Error('Crop details not available');
        }

        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        canvas.width = Math.floor(completedCrop.width * scaleX);
        canvas.height = Math.floor(completedCrop.height * scaleY);
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('No 2d context');
        }

        const cropX = completedCrop.x * scaleX;
        const cropY = completedCrop.y * scaleY;
        
        ctx.drawImage(
            image,
            cropX,
            cropY,
            canvas.width,
            canvas.height,
            0,
            0,
            canvas.width,
            canvas.height
        );
        
        return new Promise<string>((resolve, reject) => {
            canvas.toBlob(blob => {
                if (!blob) {
                    reject(new Error('Canvas is empty'));
                    return;
                }
                const fileUrl = window.URL.createObjectURL(blob);
                resolve(fileUrl);
            }, 'image/png');
        });
    }

    const onSaveClicked = async () => {
        try {
            const croppedUrl = await handleSaveCrop();
            onSave(croppedUrl);
            setOpen(false);
            setImgSrc('');
            toast({
                title: 'Success',
                description: 'Image has been updated successfully.'
            });
        } catch (e) {
            console.error(e);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to save the cropped image.'
            });
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Image</DialogTitle>
                    <DialogDescription>Upload, crop, and save your new image.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                     <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="picture">Select Image</Label>
                        <Input id="picture" type="file" accept="image/*" onChange={onSelectFile} />
                    </div>
                    {!!imgSrc && (
                        <div className='flex justify-center'>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspectRatio}
                        >
                            <img ref={imgRef} alt="Crop me" src={imgSrc} onLoad={onImageLoad} style={{ maxHeight: '70vh' }}/>
                        </ReactCrop>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button disabled={!imgSrc} onClick={onSaveClicked}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
