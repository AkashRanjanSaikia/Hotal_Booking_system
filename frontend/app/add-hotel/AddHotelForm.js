"use client";

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/usercontext";
import { revalidateHotels } from "../actions";

export default function AddHotelForm() {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    country: "",
    mainImage: "",
  });

  const [file, setFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [imageMode, setImageMode] = useState("upload");
  const [extraImageMode, setExtraImageMode] = useState("upload");
  const [extraImageUrls, setExtraImageUrls] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileChange(e) {
    setFile(e.target.files?.[0] ?? null);
  }

  function handleExtraFilesChange(e) {
    const selected = Array.from(e.target.files || []);
    if (selected.length > 4) {
      setError("You can upload a maximum of 4 extra photos.");
      setExtraFiles(selected.slice(0, 4));
    } else {
      setError("");
      setExtraFiles(selected);
    }
  }

  function handleExtraUrlChange(index, value) {
    setExtraImageUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const hasMainFile = imageMode === "upload" && file;
      const hasExtraFiles =
        extraImageMode === "upload" && extraFiles.length > 0;
      const shouldUseFormData = hasMainFile || hasExtraFiles;

      const cleanedExtraUrls = extraImageUrls
        .map((u) => u.trim())
        .filter(Boolean)
        .slice(0, 4);

      if (shouldUseFormData) {
        const fd = new FormData();
        fd.append("title", form.title);
        fd.append("description", form.description);
        fd.append("price", String(form.price));
        fd.append("location", form.location);
        fd.append("country", form.country);
        if (user?.id) {
          fd.append("ownerId", user.id);
        }

        if (hasMainFile && file) {
          fd.append("mainImage", file);
        } else if (imageMode === "url" && form.mainImage) {
          fd.append("mainImage", form.mainImage);
        }

        if (hasExtraFiles) {
          extraFiles.forEach((imgFile) => {
            fd.append("images", imgFile);
          });
        }

        if (extraImageMode === "url" && cleanedExtraUrls.length > 0) {
          fd.append("imageUrls", JSON.stringify(cleanedExtraUrls));
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/create`, {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add hotel");
        
        await revalidateHotels();
        setSuccessMsg("Hotel added successfully.");
        router.push("/manager/dashboard");
      } else {
        const payload = {
          title: form.title,
          description: form.description,
          price: Number(form.price),
          location: form.location,
          country: form.country,
          mainImage: form.mainImage
            ? {
                url: form.mainImage,
                filename: form.mainImage.split("/").pop(),
              }
            : null,
          images:
            extraImageMode === "url"
              ? cleanedExtraUrls.map((url) => ({
                  url,
                  filename: url.split("/").pop(),
                }))
              : [],
          ownerId: user?.id,
        };
        console.log(payload);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add hotel");
        
        await revalidateHotels();
        setSuccessMsg("Hotel added successfully.");
        router.push("/my-hotels");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const isFormValid = () =>
    form.title.trim() &&
    form.location.trim() &&
    form.price &&
    !isNaN(Number(form.price));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center py-10 px-4 mt-10">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8 space-y-6 mt-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">Add New Hotel</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in the details below to list your property</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}
        {successMsg && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Hotel Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. Grand Plaza"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="City, State"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Country"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-32 resize-none"
              placeholder="Tell us about your property..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Price per Night ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-2.5 text-slate-500">$</span>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg pl-8 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Main Image Selection */}
          <div className="border-t border-slate-200 pt-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Main Image</label>
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="imageMode"
                  value="upload"
                  checked={imageMode === "upload"}
                  onChange={() => setImageMode("upload")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Upload File</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="imageMode"
                  value="url"
                  checked={imageMode === "url"}
                  onChange={() => setImageMode("url")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Image URL</span>
              </label>
            </div>

            {imageMode === "upload" ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition cursor-pointer bg-slate-50">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {file && (
                    <p className="text-sm text-green-600 mt-2 font-medium">
                      Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <input
                name="mainImage"
                value={form.mainImage}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="https://example.com/image.jpg"
              />
            )}
          </div>

          {/* Extra Images Selection */}
          <div className="border-t border-slate-200 pt-5">
            <label className="block text-sm font-semibold text-slate-700 mb-3">Extra Images (Max 4)</label>
            <div className="flex items-center space-x-4 mb-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="extraImageMode"
                  value="upload"
                  checked={extraImageMode === "upload"}
                  onChange={() => setExtraImageMode("upload")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Upload Files</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="extraImageMode"
                  value="url"
                  checked={extraImageMode === "url"}
                  onChange={() => setExtraImageMode("url")}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">Image URLs</span>
              </label>
            </div>

            {extraImageMode === "upload" ? (
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg hover:border-blue-400 transition cursor-pointer bg-slate-50">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-slate-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-slate-600 justify-center">
                    <label
                      htmlFor="extra-files-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="extra-files-upload"
                        name="extra-files-upload"
                        type="file"
                        multiple
                        className="sr-only"
                        onChange={handleExtraFilesChange}
                        accept="image/*"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                  {extraFiles.length > 0 && (
                    <div className="mt-2 text-left">
                      <p className="text-sm text-green-600 font-medium">Selected Files:</p>
                      <ul className="text-xs text-slate-600 list-disc list-inside">
                        {extraFiles.map((f, i) => (
                          <li key={i}>{f.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {extraImageUrls.map((url, idx) => (
                  <input
                    key={idx}
                    value={url}
                    onChange={(e) => handleExtraUrlChange(idx, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={`Image URL #${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid()}
            className={`w-full py-3.5 rounded-lg text-white font-semibold shadow-md transition duration-200 mt-6 ${
              loading || !isFormValid()
                ? "bg-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Add Hotel"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
