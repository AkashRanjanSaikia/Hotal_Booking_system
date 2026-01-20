"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/usercontext"; // -> adjust if your context path differs

export default function AddHotelPage() {
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

        const res = await fetch("http://localhost:8000/listings/create", {
          method: "POST",
          body: fd,
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add hotel 1");
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

        const res = await fetch("http://localhost:8000/listings/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          credentials: "include",
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to add hotel 2");
        setSuccessMsg("Hotel added successfully.");
        router.push("/my-hotels");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  // minimal client-side validation helper
  const isFormValid = () =>
    form.title.trim() &&
    form.location.trim() &&
    form.price &&
    !isNaN(Number(form.price));

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center  py-10 px-4 mt-10">
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">Price per night (INR)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g. 1500"
              required
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              rows={4}
              placeholder="Short description of your hotel"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="block text-sm font-semibold text-slate-700">Hotel Image (optional)</span>
              <div className="inline-flex rounded-full border border-slate-300 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setImageMode("url");
                    setFile(null);
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    imageMode === "url"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  Image URL
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setImageMode("upload");
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    imageMode === "upload"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>

            {imageMode === "url" ? (
              <input
                key="main-image-url"
                name="mainImage"
                value={form.mainImage}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="https://..."
              />
            ) : (
              <input
                key="main-image-upload"
                name="mainImageFile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="block text-sm font-semibold text-slate-700">
                Extra Images (optional, max 4)
              </span>
              <div className="inline-flex rounded-full border border-slate-300 bg-slate-100 p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setExtraImageMode("url");
                    setExtraFiles([]);
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    extraImageMode === "url"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  Image URLs
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setExtraImageMode("upload");
                    setExtraImageUrls(["", "", "", ""]);
                  }}
                  className={`px-3 py-1 text-xs rounded-full ${
                    extraImageMode === "upload"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600"
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>

            {extraImageMode === "upload" ? (
              <input
                name="extraImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleExtraFilesChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            ) : (
              <div className="space-y-2">
                {extraImageUrls.map((url, index) => (
                  <input
                    key={index}
                    value={url}
                    onChange={(e) => handleExtraUrlChange(index, e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder={`Extra image URL ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => router.push("/my-hotels")}
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!isFormValid() || loading}
              className={`px-6 py-2.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition flex items-center gap-2`}>
              {loading && (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              {loading ? "Adding..." : "Add Hotel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
