import React, { useState, useEffect, useRef } from 'react';
import * as api from '../../services/apiService.ts';
import type { AuthCarouselImage } from '../../types.ts';
import Icon from '../Icon.tsx';

const CarouselManagement: React.FC = () => {
    const [images, setImages] = useState<AuthCarouselImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchImages = async () => {
            setIsLoading(true);
            try {
                const data = await api.getCarouselImages();
                setImages(data);
            } catch (error) {
                console.error("Failed to fetch images", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchImages();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const formData = new FormData();
            formData.append('image', e.target.files[0]);
            const newImage = await api.adminUploadCarouselImage(formData);
            setImages(prev => [...prev, newImage]);
        }
    };
    
    const handleDelete = async (id: number) => {
        await api.adminDeleteCarouselImage(id);
        setImages(prev => prev.filter(img => img.id !== id));
    };

    return (
         <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Authentication Carousel</h2>
                <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                <button onClick={() => fileInputRef.current?.click()} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm">Upload Image</button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {isLoading ? <p>Loading images...</p> : images.map(image => (
                    <div key={image.id} className="relative group">
                        <img src={image.image_url} alt="Carousel item" className="w-full h-full object-cover rounded-lg aspect-[3/4]" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                            <button onClick={() => handleDelete(image.id)} className="p-2 bg-red-600 rounded-full">
                                <Icon className="w-5 h-5"><path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselManagement;
