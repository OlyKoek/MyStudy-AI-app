"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {

  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);


  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/`, {       
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResult(data.predictions || []);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">CNN Image Classifier</h1>

      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 border p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer"
      />

      {preview && (
        <img src={preview} alt="preview" className="w-48 h-48 object-cover mb-4 rounded-lg"/>
      )}

      {loading && <p className="text-gray-500">Predicting...</p>}

      {result.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow w-72 text-gray-900 border border-gray-300 rounded-lg ">
          {result.map((r, i) => (
            <p key={i} className="text-lg">
              {r.label}: {(r.probability * 100).toFixed(1)}%
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
