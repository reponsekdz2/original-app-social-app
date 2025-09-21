import React, { useState, useEffect, useRef } from 'react';
import * as api from '../../services/apiService.ts';
import type { AuthCarouselImage } from '../../types.ts';
import Icon from '../Icon.tsx';

const CarouselManagement: React.FC = () => {
    const [images, setImages] = useState<AuthCarouselImage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newImageFile, setNewImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const data = await api.adminGetCarouselImages();
            setImages(data);
        } catch (error) {
            console.error("Failed to fetch carousel images:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setNewImageFile(e.target.files[0]);
        }
    };

    const handleAddImage = async () => {
        if (!newImageFile) {
            alert('Please select an image file to upload.');
            return;
        }
        const formData = new FormData();
        formData.append('image', newImageFile);
        try {
            await api.adminAddCarouselImage(formData);
            setNewImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
            await fetchImages();
        } catch (error) {
            console.error("Failed to upload image:", error);
            alert('Failed to upload image.');
        }
    };

    const handleDeleteImage = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this image from the carousel?")) return;
        try {
            await api.adminDeleteCarouselImage(id);
            await fetchImages();
        } catch (error) {
            console.error("Failed to delete image:", error);
            alert('Failed to delete image.');
        }
    };

    return (
        <div className="bg-gray-800 p-5 rounded-lg border border-gray-700">
            <h3 className="font-bold text-lg mb-4">Auth Screen Carousel</h3>
            <p className="text-sm text-gray-400 mb-4">Manage the images that rotate on the login and registration screen. Use high-quality, vertically-oriented images for the best results.</p>

            <div className="flex gap-2 mb-6">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-500/20 file:text-red-300 hover:file:bg-red-500/30"
                />
                <button
                    onClick={handleAddImage}
                    disabled={!newImageFile}
                    className="px-4 py-2 text-sm bg-red-600 rounded-md hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                    Upload Image
                </button>
            </div>

            {isLoading ? (
                <p className="text-center text-gray-400">Loading images...</p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map(image => (
                        <div key={image.id} className="relative group aspect-[9/16]">
                            <img src={image.image_url} alt="Carousel item" className="w-full h-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => handleDeleteImage(image.id)}
                                    className="p-2 bg-red-600/80 rounded-full text-white"
                                >
                                    <Icon className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></Icon>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CarouselManagement;