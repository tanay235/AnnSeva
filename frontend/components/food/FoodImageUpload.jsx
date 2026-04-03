"use client";

import { useEffect, useState } from "react";

export default function FoodImageUpload({ file, onChange, error }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return (
    <div className="food-upload">
      <label className="label">Food Image Upload</label>
      <input
        type="file"
        accept="image/*"
        onChange={event => {
          const selected = event.target.files?.[0] || null;
          onChange(selected);
        }}
      />
      {previewUrl && (
        <div className="preview-wrap">
          <img src={previewUrl} alt="Food preview" className="preview" />
        </div>
      )}
      {error ? <p className="error">{error}</p> : null}

      <style jsx>{`
        .food-upload {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 14px;
          border: 1px solid #dde9e1;
          border-radius: 14px;
          background: linear-gradient(180deg, #ffffff, #f9fdfb);
        }
        .label {
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #334155;
        }
        .preview-wrap {
          width: 200px;
          height: 200px;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #cde3d6;
          box-shadow: 0 14px 26px rgba(15, 23, 42, 0.12);
        }
        .preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .error {
          margin: 0;
          color: #b91c1c;
          font-size: 13px;
          font-weight: 500;
        }
        :global(input[type="file"]) {
          background: #ffffff;
          border: 1px solid #cfddd2;
          border-radius: 10px;
          padding: 7px;
        }
      `}</style>
    </div>
  );
}
