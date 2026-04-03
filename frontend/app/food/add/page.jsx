"use client";

import { useMemo, useState } from "react";
import AIResultBox from "../../../components/food/AIResultBox";
import FoodForm from "../../../components/food/FoodForm";
import { checkFoodSafety } from "../../../services/aiService";
import { createFoodListing } from "../../../services/foodService";

const INITIAL_FORM = {
  imageFile: null,
  foodName: "",
  quantity: "",
  category: "",
  expiryDate: "",
  originalPrice: "",
  location: "",
  notes: "",
};

function createFormSignature(values) {
  return JSON.stringify({
    foodName: values.foodName.trim(),
    quantity: values.quantity,
    category: values.category.trim(),
    expiryDate: values.expiryDate,
    originalPrice: values.originalPrice,
    location: values.location.trim(),
    notes: values.notes.trim(),
    imageName: values.imageFile?.name || "",
    imageSize: values.imageFile?.size || "",
    imageMtime: values.imageFile?.lastModified || "",
  });
}

function validate(values) {
  const errors = {};

  if (!values.imageFile) {
    errors.imageFile = "Please upload a food image.";
  }
  if (!values.foodName.trim()) {
    errors.foodName = "Item name is required.";
  }
  if (!values.quantity || Number(values.quantity) <= 0) {
    errors.quantity = "Quantity must be greater than 0.";
  }
  if (!values.expiryDate) {
    errors.expiryDate = "Expiry date is required.";
  }
  if (values.expiryDate) {
    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    ).getTime();
    const selectedDateOnly = new Date(`${values.expiryDate}T00:00:00`).getTime();
    if (selectedDateOnly < todayDateOnly) {
      errors.expiryDate = "Expiry date cannot be in the past.";
    }
  }
  if (!values.originalPrice || Number(values.originalPrice) <= 0) {
    errors.originalPrice = "Original price must be greater than 0.";
  }
  if (!values.location.trim()) {
    errors.location = "Pickup location is required.";
  }

  return errors;
}

export default function AddFoodPage() {
  const [values, setValues] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [aiResult, setAiResult] = useState(null);
  const [checkedSignature, setCheckedSignature] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [aiError, setAiError] = useState("");
  const [message, setMessage] = useState("");
  const [yourPrice, setYourPrice] = useState("");

  const currentSignature = useMemo(() => createFormSignature(values), [values]);
  const isAiValidForCurrentForm = checkedSignature && checkedSignature === currentSignature;
  const parsedYourPrice = Number(yourPrice);
  const isYourPriceValid =
    yourPrice !== "" &&
    Number.isFinite(parsedYourPrice) &&
    parsedYourPrice > 0 &&
    parsedYourPrice <= Number(values.originalPrice || 0);
  const canPublish = isAiValidForCurrentForm && isYourPriceValid && !publishLoading;

  const setFieldValue = (field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setAiError("");
    setMessage("");
  };

  const handleSuggestPrice = async () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setAiError("");
    setMessage("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setAiLoading(true);
    try {
      const result = await checkFoodSafety({
        imageFile: values.imageFile,
        foodName: values.foodName.trim(),
        expiryDate: values.expiryDate,
        originalPrice: Number(values.originalPrice),
        category: values.category.trim(),
        notes: values.notes.trim(),
      });
      setAiResult(result);
      setCheckedSignature(currentSignature);
      if (typeof result?.expectedSellPrice === "number") {
        setYourPrice(String(result.expectedSellPrice));
      }
    } catch (error) {
      setAiError(error.message || "Unable to generate price suggestion.");
      setAiResult(null);
      setCheckedSignature("");
    } finally {
      setAiLoading(false);
    }
  };

  const handlePublish = async event => {
    event.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);
    setMessage("");

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!isAiValidForCurrentForm) {
      setAiError("Run price suggestion before publishing.");
      return;
    }

    if (!isYourPriceValid) {
      setAiError("Enter a valid price greater than 0 and not above original price.");
      return;
    }

    setPublishLoading(true);
    try {
      await createFoodListing({
        foodName: values.foodName.trim(),
        quantity: Number(values.quantity),
        category: values.category.trim(),
        expiryDate: values.expiryDate,
        originalPrice: Number(values.originalPrice),
        location: values.location.trim(),
        notes: values.notes.trim(),
        imageName: values.imageFile?.name || "",
        yourPrice: parsedYourPrice,
        aiResult,
      });

      setMessage("Listing published successfully.");
      setAiError("");
      setErrors({});
      setAiResult(null);
      setCheckedSignature("");
      setYourPrice("");
      setValues(INITIAL_FORM);
    } catch (error) {
      setMessage("");
      setAiError(error.message || "Unable to publish listing.");
    } finally {
      setPublishLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setAiError("Geolocation is not supported on this browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        const label = `Lat ${position.coords.latitude.toFixed(5)}, Lng ${position.coords.longitude.toFixed(5)}`;
        setValues(prev => ({ ...prev, location: label }));
        setLoadingLocation(false);
      },
      () => {
        setLoadingLocation(false);
        setAiError("Unable to fetch current location.");
      }
    );
  };

  const showStaleWarning = aiResult && !isAiValidForCurrentForm;

  return (
    <main className="page">
      <div className="bg-orb orb-a" />
      <div className="bg-orb orb-b" />
      <section className="container">
        <div className="heading-wrap">
          <p className="eyebrow">Donor Workspace</p>
          <h1>Add Packaged Item Listing</h1>
          <p className="subtitle">
            Publish industry packaged items with AI-powered pricing suggestions based on expiry.
          </p>
        </div>

        <div className="showcase">
          <div className="showcase-track">
            <article className="showcase-card">
              <img
                src="https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Packaged goods shelves"
              />
              <div className="overlay">
                <p>Smart Donation</p>
                <span>Upload inventory, verify expiry, publish fast</span>
              </div>
            </article>

            <article className="showcase-card">
              <img
                src="https://images.pexels.com/photos/6169028/pexels-photo-6169028.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Packaged products in a store aisle"
              />
              <div className="overlay">
                <p>AI Pricing</p>
                <span>Expiry-aware discount and expected selling rate</span>
              </div>
            </article>

            <article className="showcase-card">
              <img
                src="https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Warehouse logistics boxes"
              />
              <div className="overlay">
                <p>Real Impact</p>
                <span>Every package reaches communities at affordable rates</span>
              </div>
            </article>
          </div>
        </div>

        <form onSubmit={handlePublish} className="layout">
          <div className="left panel-glow">
            <FoodForm
              values={values}
              errors={errors}
              onFieldChange={setFieldValue}
              onImageChange={file => setFieldValue("imageFile", file)}
              onUseCurrentLocation={handleUseCurrentLocation}
              loadingLocation={loadingLocation}
            />
          </div>

          <div className="right panel-glow">
            <button
              type="button"
              className="check-btn"
              onClick={handleSuggestPrice}
              disabled={aiLoading}
            >
              {aiLoading ? "Analyzing..." : "Suggest Price"}
            </button>

            <AIResultBox result={aiResult} />

            {showStaleWarning ? (
              <p className="warning">
                Form details changed after suggestion. Please run suggestion again.
              </p>
            ) : null}

            {aiError ? <p className="error">{aiError}</p> : null}
            {message ? <p className="success">{message}</p> : null}

            <label className="price-input-wrap">
              <span>Your Price (INR)</span>
              <input
                type="number"
                min="1"
                step="0.01"
                value={yourPrice}
                onChange={event => {
                  setYourPrice(event.target.value);
                  setAiError("");
                }}
                placeholder="Enter your selling price"
              />
            </label>

            <button type="submit" className="publish-btn" disabled={!canPublish}>
              {publishLoading ? "Publishing..." : "Publish Packaged Listing"}
            </button>
          </div>
        </form>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 32px 16px 56px;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(1200px 500px at 5% -10%, #d8f6e8 0%, transparent 55%),
            radial-gradient(900px 500px at 110% 110%, #fff0d1 0%, transparent 55%),
            linear-gradient(180deg, #fcfef9 0%, #f5f8ef 100%);
        }
        .bg-orb {
          position: absolute;
          border-radius: 999px;
          filter: blur(2px);
          pointer-events: none;
        }
        .orb-a {
          width: 240px;
          height: 240px;
          background: linear-gradient(135deg, #c4f4de, #9be7c7);
          top: 80px;
          right: -80px;
          opacity: 0.55;
        }
        .orb-b {
          width: 180px;
          height: 180px;
          background: linear-gradient(135deg, #ffe4b3, #ffd08a);
          bottom: 70px;
          left: -70px;
          opacity: 0.5;
        }
        .container {
          position: relative;
          max-width: 1100px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 24px;
          border: 1px solid rgba(219, 227, 221, 0.9);
          backdrop-filter: blur(6px);
          padding: 24px;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
        }
        .heading-wrap {
          margin-bottom: 18px;
        }
        .eyebrow {
          margin: 0 0 10px;
          display: inline-block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0b7c57;
          background: #d9f5ea;
          border: 1px solid #b8e7d2;
          border-radius: 999px;
          padding: 6px 10px;
        }
        h1 {
          margin: 0;
          font-size: clamp(30px, 4vw, 44px);
          color: #0f172a;
          line-height: 1.05;
        }
        .subtitle {
          margin: 10px 0 6px;
          color: #334155;
          max-width: 760px;
          font-size: 15px;
        }
        .showcase {
          border-radius: 18px;
          border: 1px solid #dfe9e2;
          background: linear-gradient(180deg, #ffffff, #f7fbf8);
          padding: 10px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .showcase-track {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .showcase-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          height: 170px;
          isolation: isolate;
          animation: floatCard 4.8s ease-in-out infinite;
        }
        .showcase-card:nth-child(2) {
          animation-delay: 0.35s;
        }
        .showcase-card:nth-child(3) {
          animation-delay: 0.7s;
        }
        .showcase-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.03);
        }
        .showcase-card::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 35%, rgba(7, 14, 25, 0.82) 100%);
          z-index: 1;
        }
        .overlay {
          position: absolute;
          left: 12px;
          right: 12px;
          bottom: 10px;
          z-index: 2;
          color: #ffffff;
        }
        .overlay p {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: 0.01em;
        }
        .overlay span {
          display: block;
          margin-top: 3px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.88);
        }
        .layout {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 16px;
        }
        .left,
        .right {
          border: 1px solid #e2ebe4;
          border-radius: 18px;
          padding: 18px;
          background: #ffffff;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
        }
        .right {
          display: flex;
          flex-direction: column;
          gap: 12px;
          height: fit-content;
        }
        .panel-glow {
          position: relative;
        }
        .panel-glow::before {
          content: "";
          position: absolute;
          inset: -1px;
          border-radius: 18px;
          background: linear-gradient(130deg, rgba(14, 159, 110, 0.2), rgba(245, 158, 11, 0.14));
          z-index: 0;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .panel-glow:hover::before {
          opacity: 1;
        }
        .panel-glow :global(*) {
          position: relative;
          z-index: 1;
        }
        .check-btn,
        .publish-btn {
          border: none;
          border-radius: 12px;
          height: 48px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: transform 0.16s ease, box-shadow 0.16s ease, opacity 0.16s ease;
        }
        .check-btn {
          background: linear-gradient(135deg, #0e9f6e, #0b7c57);
          color: #fff;
          box-shadow: 0 10px 20px rgba(14, 159, 110, 0.26);
        }
        .check-btn:hover:enabled {
          transform: translateY(-1px);
        }
        .check-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .publish-btn {
          background: linear-gradient(135deg, #ffce74, #f6ab2f);
          color: #3b2c12;
          box-shadow: 0 10px 20px rgba(245, 158, 11, 0.26);
        }
        .publish-btn:hover:enabled {
          transform: translateY(-1px);
        }
        .publish-btn:disabled {
          background: #e5e7eb;
          color: #6b7280;
          box-shadow: none;
          cursor: not-allowed;
        }
        .price-input-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .price-input-wrap span {
          font-weight: 700;
          font-size: 13px;
          color: #1f2937;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .price-input-wrap input {
          border: 1px solid #cfdad3;
          border-radius: 10px;
          height: 44px;
          padding: 0 12px;
          font-size: 15px;
          outline: none;
          background: #ffffff;
        }
        .price-input-wrap input:focus {
          border-color: #0e9f6e;
          box-shadow: 0 0 0 3px rgba(14, 159, 110, 0.16);
        }
        .warning {
          margin: 0;
          color: #9a4d00;
          background: #fff6e6;
          border: 1px solid #f8d7a6;
          border-radius: 10px;
          padding: 11px;
          font-size: 14px;
        }
        .error {
          margin: 0;
          color: #b91c1c;
          background: #ffecec;
          border: 1px solid #fecaca;
          border-radius: 10px;
          padding: 11px;
          font-size: 14px;
        }
        .success {
          margin: 0;
          color: #166534;
          background: #effef5;
          border: 1px solid #bbf7d0;
          border-radius: 10px;
          padding: 11px;
          font-size: 14px;
        }

        @media (max-width: 980px) {
          .showcase-track {
            grid-template-columns: 1fr;
          }
          .showcase-card {
            height: 155px;
          }
          .layout {
            grid-template-columns: 1fr;
          }
          .container {
            padding: 18px;
            border-radius: 18px;
          }
          .left,
          .right {
            padding: 14px;
          }
        }
        @keyframes floatCard {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </main>
  );
}
