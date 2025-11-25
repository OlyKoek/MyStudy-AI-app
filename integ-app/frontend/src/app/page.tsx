"use client";

import { useState } from "react";

type SearchResult = {
  image_path: string;
  caption: string;
  similarity: number;
};

export default function Home() {
  const [textQuery, setTextQuery] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<"text" | "image">("text");

  const handleTextSearch = async () => {
    if (!textQuery.trim()) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("query", textQuery);
      formData.append("top_k", "5");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/text`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error searching by text:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSearch = async () => {
    if (!imageFile) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("top_k", "5");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error searching by image:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold mb-2 text-blue-600">MINI CLIP Image Search</h1>
      <p className="text-gray-600 mb-8">テキストまたは画像で類似画像を検索</p>

      {/* モード切替 */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSearchMode("text")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            searchMode === "text"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          テキスト検索
        </button>
        <button
          onClick={() => setSearchMode("image")}
          className={`px-6 py-2 rounded-lg font-semibold transition ${
            searchMode === "image"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          画像検索
        </button>
      </div>

      {/* テキスト検索UI */}
      {searchMode === "text" && (
        <div className="w-full max-w-2xl">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={textQuery}
              onChange={(e) => setTextQuery(e.target.value)}
              placeholder="検索キーワードを入力 (例: 猫, 風景, 笑顔)"
              className="flex-1 p-3 border border-gray-300 rounded-lg text-gray-900"
              onKeyDown={(e) => e.key === "Enter" && handleTextSearch()}
            />
            <button
              onClick={handleTextSearch}
              disabled={loading || !textQuery.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "検索中..." : "検索"}
            </button>
          </div>
        </div>
      )}

      {/* 画像検索UI */}
      {searchMode === "image" && (
        <div className="w-full max-w-2xl">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="mb-4 p-2 border border-gray-300 rounded-lg cursor-pointer text-gray-900 w-full"
          />
          {preview && (
            <div className="mb-4 flex justify-center">
              <img
                src={preview}
                alt="preview"
                className="w-64 h-64 object-cover rounded-lg border-2 border-gray-300"
              />
            </div>
          )}
          <button
            onClick={handleImageSearch}
            disabled={loading || !imageFile}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "検索中..." : "類似画像を検索"}
          </button>
        </div>
      )}

      {/* 検索結果 */}
      {results.length > 0 && (
        <div className="w-full max-w-4xl mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">検索結果</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
              >
                <div className="mb-2 text-gray-700 font-medium">
                  類似度: {(result.similarity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {result.caption || "キャプションなし"}
                </div>
                <div className="text-xs text-gray-400 break-all">
                  {result.image_path}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
